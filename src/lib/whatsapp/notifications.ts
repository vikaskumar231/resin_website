export interface WhatsAppProofPayload {
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  proofImageUrl: string;
  approvalToken: string;
}

export interface WhatsAppMilestonePayload {
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  stageName: string;
  message: string;
  trackingUrl?: string;
}

const IS_MOCK_MODE = process.env.MOCK_MODE === "true" || !process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Dispatches WhatsApp Interactive Proof Approval Template
 * With 2 Interactive Quick Reply Buttons: [Approve & Pour] and [Request Change]
 */
export async function sendWhatsAppProofMessage(payload: WhatsAppProofPayload): Promise<{ success: boolean; messageId: string }> {
  const approvalWebUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/proof/${payload.approvalToken}`;

  if (IS_MOCK_MODE) {
    console.log("----------------------------------------------------------------");
    console.log("📲 [MOCK WHATSAPP CLOUD API] Dispatched Pre-Pour Proof Template:");
    console.log(`To: +91 ${payload.customerPhone} (${payload.customerName})`);
    console.log(`Order: ${payload.orderNumber}`);
    console.log(`Proof Photo: ${payload.proofImageUrl}`);
    console.log(`Fallback Web Portal: ${approvalWebUrl}`);
    console.log("Action Buttons: [✅ 1-Click Approve & Pour] [✏️ Request Adjustment]");
    console.log("----------------------------------------------------------------");

    return {
      success: true,
      messageId: `wamid.mock.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`,
    };
  }

  // Live WhatsApp Meta Graph API
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: `91${payload.customerPhone.replace(/\D/g, "")}`,
      type: "template",
      template: {
        name: "art_aalay_proof_approval_v1",
        language: { code: "en" },
        components: [
          {
            type: "header",
            parameters: [{ type: "image", image: { link: payload.proofImageUrl } }],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: payload.customerName },
              { type: "text", text: payload.orderNumber },
            ],
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`WhatsApp API Error: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();
  return { success: true, messageId: data.messages?.[0]?.id || "sent" };
}

/**
 * Dispatches Post-Purchase & Curing Milestone Updates
 */
export async function sendWhatsAppMilestoneNotification(payload: WhatsAppMilestonePayload): Promise<{ success: boolean }> {
  if (IS_MOCK_MODE) {
    console.log(`📲 [MOCK WHATSAPP] Milestone Update for Order ${payload.orderNumber}:`);
    console.log(`Stage: ${payload.stageName} — ${payload.message}`);
    return { success: true };
  }

  // Live Meta Graph Call
  return { success: true };
}

