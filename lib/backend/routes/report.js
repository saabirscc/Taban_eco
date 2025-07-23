const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const ExcelJS = require('exceljs');

const {
  participation,
  wasteAnalysis,
  districtPerformance
} = require('../controllers/reportController');

// Chart config
const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// ───── Standard report routes ─────
router.get('/participation', participation);
router.get('/waste-analysis', wasteAnalysis);
router.get('/district-performance', districtPerformance);

// ───── PDF Export ─────
router.get('/participation/pdf', async (req, res, next) => {
  try {
    const data = await getParticipationData();

    const labels = data.cleanupsByMonth.map(c => c._id);
    const cleanups = data.cleanupsByMonth.map(c => c.count);
    const feedback = labels.map(label => {
      const match = data.feedbackByMonth.find(f => f._id === label);
      return match ? match.count : 0;
    });

    const chartConfig = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cleanups',
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            data: cleanups,
          },
          {
            label: 'Feedback',
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            data: feedback,
          }
        ]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Participation Report by Month',
            font: { size: 20 }
          }
        }
      }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=participation-report.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Participation Report (Cleanups & Feedback)', { align: 'center' });
    doc.moveDown(1);
    doc.image(imageBuffer, {
      fit: [500, 300],
      align: 'center',
      valign: 'center'
    });

    doc.end();
  } catch (err) {
    next(err);
  }
});

// ───── Excel Export ─────
router.get('/participation/excel', async (req, res, next) => {
  try {
    const data = await getParticipationData();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Participation Report');

    sheet.columns = [
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Cleanups', key: 'cleanups', width: 15 },
      { header: 'Feedback', key: 'feedback', width: 15 }
    ];

    data.cleanupsByMonth.forEach((c) => {
      const f = data.feedbackByMonth.find(fb => fb._id === c._id);
      sheet.addRow({
        month: c._id,
        cleanups: c.count,
        feedback: f ? f.count : 0
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=participation-report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

// ───── Data Fetcher ─────
async function getParticipationData() {
  const Cleanup = require('../models/Cleanup');
  const Feedback = require('../models/Feedback');

  const cleanupsByMonth = await Cleanup.aggregate([
    { $match: { status: { $in: ['approved', 'completed'] } } },
    { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
  ]);

  const feedbackByMonth = await Feedback.aggregate([
    { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
  ]);

  return { cleanupsByMonth, feedbackByMonth };
}

module.exports = router;