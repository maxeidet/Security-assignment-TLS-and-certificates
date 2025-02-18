import fetch from "node-fetch";
// modify the domain and cn to match the domain you want to check
const domain = "liu.se";
const cn = "liu.se";
const crtShUrl = `https://crt.sh/?q=%.${domain}&output=json`;
const crtShUrlNonExpired = `https://crt.sh/?q=${domain}&exclude=expired&group=none&output=json`;

async function fetchCertificates() {
  try {
    const response = await fetch(crtShUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const responseNonExpired = await fetch(crtShUrlNonExpired);
    if (!responseNonExpired.ok) {
      throw new Error(`HTTP error! Status: ${responseNonExpired.status}`);
    }
    const dataNonExpired = await responseNonExpired.json();

    const now = new Date();
    let expiredCount = 0;
    data.forEach((cert) => {
      const expiryDate = new Date(cert.not_after);
      if (expiryDate < now) {
        expiredCount++;
      }
    });

    const filteredCertificates = dataNonExpired.filter((cert) =>
      cert.common_name.startsWith(cn)
    );

    const ids = filteredCertificates.map((cert) => cert.id);

    console.log(
      `Total Certificates Found: ${data.length + dataNonExpired.length}`
    );
    console.log(`Expired Certificates: ${expiredCount}`);
    console.log(`Non-expired Certificates Found: ${dataNonExpired.length}`);

    console.log(
      `Certificates with common_name starting with ${cn}: ${filteredCertificates.length}`
    );

    console.log(
      `IDs of certificates with common_name starting with ${domain}:`,
      ids
    );
  } catch (error) {
    console.error("Error fetching certificate data:", error);
  }
}

fetchCertificates();
