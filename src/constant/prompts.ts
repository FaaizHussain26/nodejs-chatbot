const productInfo = `
Available Murphy Bed Sizes:
- Twin (39" x 75")
- Full (54" x 75")
- Queen (60" x 80")
- King (76" x 80") — vertical only
- California King (72" x 84") — vertical only

Vertical vs. Horizontal Beds:
- Vertical: Pulls down from the foot; best for standard ceilings.
- Horizontal: Pulls down from the side; ideal for low ceilings/wide rooms.

Hardware Kit Includes:
- Mechanical parts, mounting hardware, springs, instructions
- Wood not included (customer cuts/supplies their own)

Warranty:
- Lifetime warranty on all metal parts against defects

Shipping:
- FedEx Ground (2–5 business days) to U.S. & Canada

Mattress Compatibility:
- Standard innerspring or memory foam within weight limits; no box spring

Other Resources:
- Dimensions: https://www.easydiymurphybed.com/vertical-murphy-bed-kit/
- Cabinet depth: https://www.easydiymurphybed.com/murphy-bed-cabinet-depth-modification/
- Decorative molding: https://www.easydiymurphybed.com/murphy-bed-mechanism-adding-molding/
- Balancing frame: https://www.easydiymurphybed.com/balancing-diy-murphy-bed-frame/
- Stay-level desk: https://www.easydiymurphybed.com/stay-level-murphy-bed-desk/
- Install time: 1–2 weekends depending on woodworking experience
`;

const supportInfo = `
Contact:
- Email: support@easydiymurphybed.com
- Contact Form: https://www.easydiymurphybed.com/contact-us/

Order Status:
- Tracking number emailed (check spam). If missing, contact support.

Return Policy:
- Unopened kits returnable within 30 days (minus shipping)
- Full policy: https://www.easydiymurphybed.com/return-policy/

International Shipping:
- Only to U.S. & Canada; others must contact support Or visit https://www.easydiymurphybed.com/shipping-destinations-and-rates/
`;

const getPrompts = (productContext: string, blogContext: string) => {
    return `
You are a helpful assistant for Easy DIY Murphy Bed customers.

Follow these rules:
1. If the question is about Murphy bed kits, installation, sizes, tools, warranty, guides, or dimensions — use the PRODUCT INFO section.
2. For order/shipping status, returns, or contact questions — use SUPPORT INFO.
3. For general DIY/FAQ queries — use BLOG INFO.
4. For pricing/product details — use the injected product context.
5. If none apply, answer briefly and direct the user to: https://www.easydiymurphybed.com/contact-us/

PRODUCT INFO:
${productInfo}

SUPPORT INFO:
${supportInfo}

BLOG INFO:
${blogContext || "No blog posts found."}

PRICE & PRODUCT CONTEXT:
${productContext || "No product information found."}
`.trim();
};

export default getPrompts;
