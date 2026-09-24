const base = "http://localhost:3000";
const origin = base;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function jsonPost(path, payload, cookie = "") {
  return fetch(base + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(payload),
    redirect: "manual",
  });
}

function sessionCookie(response) {
  const setCookie = response.headers.get("set-cookie") || "";
  const match = setCookie.match(/(?:^|,\\s*)sm_session=([^;]+)/);
  assert(match, "Session cookie was not issued");
  return "sm_session=" + match[1];
}

const email = "ci-" + Date.now() + "@example.com";
const password = "CiSmokePass123!";

const register = await jsonPost("/api/auth/register", {
  name: "CI Smoke User",
  email,
  password,
});
assert(register.status === 200, "Register failed: HTTP " + register.status);
const cookie = sessionCookie(register);

const booking = await jsonPost("/api/booking/draft", {
  origin: "ujung",
  destination: "kamal",
  departureDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
  serviceType: "passenger",
  vehicle: "passenger",
  passengerName: "CI Smoke User",
  passengerNik: "3273010101010001",
  passengerPhone: "081234567890",
  vehiclePlate: "",
}, cookie);
assert(booking.status === 200, "Booking draft failed: HTTP " + booking.status);
const bookingBody = await booking.json();
assert(bookingBody.ok === true && bookingBody.draftId, "Booking draft response is invalid");

const paymentBody = new URLSearchParams({
  draft_id: bookingBody.draftId,
  payment_method: "gopay",
});
const payment = await fetch(base + "/api/payment/complete", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: origin,
    Cookie: cookie,
  },
  body: paymentBody,
  redirect: "manual",
});
assert(payment.status >= 300 && payment.status < 400, "Payment did not redirect: HTTP " + payment.status);
const ticketLocation = payment.headers.get("location");
assert(ticketLocation, "Payment redirect did not contain a ticket location");
const ticketUrl = new URL(ticketLocation, base);
assert(ticketUrl.pathname === "/ticket" && ticketUrl.searchParams.has("ticket"), "Payment redirect did not point to a ticket");
const ticketId = ticketUrl.searchParams.get("ticket");

const ticket = await fetch(ticketUrl, { headers: { Cookie: cookie } });
assert(ticket.status === 200, "Ticket page failed: HTTP " + ticket.status);

const verifyUrl = new URL("/ticket/verify", base);
verifyUrl.searchParams.set("ticket", ticketId);
const verify = await fetch(verifyUrl);
assert(verify.status === 200, "Ticket verification failed: HTTP " + verify.status);
const verifyHtml = await verify.text();
assert(verifyHtml.includes("Verified"), "Ticket verification did not report Verified");

const myTickets = await fetch(base + "/my-tickets", { headers: { Cookie: cookie } });
assert(myTickets.status === 200, "My Tickets failed: HTTP " + myTickets.status);

console.log("E2E smoke passed:", { email, ticketId });
