// FlowEM Email Compilation & Personalization Engine

export function compileEmailHtml(templateHtml, variables = {}) {
  const {
    firstName = 'Subscriber',
    lastName = '',
    email = '',
    companyName = 'Brainovision Solutions India Pvt Ltd',
    companyAddress = 'Hyderabad, Telangana, India',
    unsubscribeUrl = 'https://flowem.brainovision.in/unsubscribe',
    trackingPixelUrl = '',
    clickTrackingPrefix = ''
  } = variables;

  let compiled = templateHtml || '';

  // 1. Substitute variables
  compiled = compiled.replace(/{{firstName}}/g, firstName || 'Subscriber');
  compiled = compiled.replace(/{{lastName}}/g, lastName || '');
  compiled = compiled.replace(/{{email}}/g, email || '');
  compiled = compiled.replace(/{{companyName}}/g, companyName || '');
  compiled = compiled.replace(/{{unsubscribeUrl}}/g, unsubscribeUrl);

  // 2. Ensure compliance footer exists
  const hasUnsubscribe = compiled.toLowerCase().includes('unsubscribe');
  const hasAddress = compiled.toLowerCase().includes('hyderabad') || compiled.toLowerCase().includes('address');

  if (!hasUnsubscribe || !hasAddress) {
    const complianceFooter = `
<div style="margin-top: 40px; padding: 24px 16px; border-top: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.6; color: #64748b; text-align: center;">
  <p style="margin: 0 0 8px 0; color: #334155; font-weight: 600;">${companyName}</p>
  <p style="margin: 0 0 12px 0;">${companyAddress}</p>
  <p style="margin: 0;">
    You are receiving this communication because you are subscribed to Brainovision updates.
    <a href="${unsubscribeUrl}" style="color: #4f46e5; text-decoration: underline; margin-left: 6px;">Unsubscribe immediately</a>
  </p>
</div>
`;
    if (compiled.includes('</body>')) {
      compiled = compiled.replace('</body>', `${complianceFooter}</body>`);
    } else {
      compiled += complianceFooter;
    }
  }

  // 3. Inject open tracking pixel if URL provided
  if (trackingPixelUrl) {
    const pixelTag = `<img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;
    if (compiled.includes('</body>')) {
      compiled = compiled.replace('</body>', `${pixelTag}</body>`);
    } else {
      compiled += pixelTag;
    }
  }

  // 4. Wrap links for click tracking if prefix provided
  if (clickTrackingPrefix) {
    compiled = compiled.replace(/href="(https?:\/\/[^"]+)"/g, (match, url) => {
      if (url.includes('unsubscribe') || url.includes('track/')) return match;
      const encoded = encodeURIComponent(url);
      return `href="${clickTrackingPrefix}?target=${encoded}"`;
    });
  }

  return compiled;
}

