const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateOfferLetter = (application) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, "../uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      const filePath = path.join(
        uploadsDir,
        `offer_${application._id}.pdf`
      );

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text("OFFER LETTER", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.text(`Dear ${application.applicant.name},`);
      doc.moveDown();

      doc.text(
        `We are pleased to offer you the position of "${application.job.title}" at ${application.job.company}.`
      );
      doc.moveDown();

      doc.text(
        `Your employment will commence on a mutually agreed date.`
      );
      doc.moveDown();

      doc.text(
        `Compensation: ${application.job.salary || "As discussed"}`
      );
      doc.moveDown(2);

      doc.text("We look forward to welcoming you to our team.");
      doc.moveDown(2);

      doc.text("Sincerely,");
      doc.text(application.job.company);

      doc.end();

      stream.on("finish", () => resolve(filePath));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateOfferLetter;
