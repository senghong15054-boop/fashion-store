import fs from "fs";
import path from "path";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export async function sendTelegramOrderNotification(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const itemLines = (order.items || [])
    .map((item) => `• ${escapeHtml(item.name)} x${item.qty} (${escapeHtml(item.color)} / ${escapeHtml(item.size)})`)
    .join("\n");

  const message = [
    "<b>New Order Received</b>",
    `Order ID: <b>#${order.id}</b>`,
    `Customer: ${escapeHtml(order.customerName)}`,
    `Phone: ${escapeHtml(order.phone)}`,
    `Total: <b>$${Number(order.total).toFixed(2)}</b>`,
    `Address: ${escapeHtml(order.address)}`,
    order.couponCode ? `Coupon: ${escapeHtml(order.couponCode)}` : null,
    order.note ? `Note: ${escapeHtml(order.note)}` : null,
    itemLines ? `Items:\n${itemLines}` : null,
    `Screenshot: ${order.paymentScreenshot ? "Uploaded" : "Missing"}`
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram notification failed: ${body}`);
  }

  if (order.paymentScreenshot) {
    const screenshotFile = path.resolve(order.paymentScreenshot.replace(/^\//, ""));

    if (fs.existsSync(screenshotFile)) {
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", `Payment screenshot for order #${order.id}`);
      formData.append("photo", new Blob([fs.readFileSync(screenshotFile)]), path.basename(screenshotFile));

      const photoResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: formData
      });

      if (!photoResponse.ok) {
        const body = await photoResponse.text();
        throw new Error(`Telegram photo notification failed: ${body}`);
      }
    }
  }
}
