// const express = require('express');
// const router = express.Router();
// const PDFDocument = require('pdfkit');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
// const ExcelJS = require('exceljs');

// const {
//   participation,
//   wasteAnalysis,
//   districtPerformance
// } = require('../controllers/reportController');

// // Chart config
// const width = 800;
// const height = 400;
// const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// // ───── Standard report routes ─────
// router.get('/participation', participation);
// router.get('/waste-analysis', wasteAnalysis);
// router.get('/district-performance', districtPerformance);

// // ───── PDF Export ─────
// router.get('/participation/pdf', async (req, res, next) => {
//   try {
//     const data = await getParticipationData();

//     const labels = data.cleanupsByMonth.map(c => c._id);
//     const cleanups = data.cleanupsByMonth.map(c => c.count);
//     const feedback = labels.map(label => {
//       const match = data.feedbackByMonth.find(f => f._id === label);
//       return match ? match.count : 0;
//     });

//     const chartConfig = {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [
//           {
//             label: 'Cleanups',
//             backgroundColor: 'rgba(75, 192, 192, 0.7)',
//             data: cleanups,
//           },
//           {
//             label: 'Feedback',
//             backgroundColor: 'rgba(153, 102, 255, 0.7)',
//             data: feedback,
//           }
//         ]
//       },
//       options: {
//         responsive: false,
//         plugins: {
//           legend: { position: 'top' },
//           title: {
//             display: true,
//             text: 'Participation Report by Month',
//             font: { size: 20 }
//           }
//         }
//       }
//     };

//     const imageBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=participation-report.pdf');
//     doc.pipe(res);

//     doc.fontSize(18).text('Participation Report (Cleanups & Feedback)', { align: 'center' });
//     doc.moveDown(1);
//     doc.image(imageBuffer, {
//       fit: [500, 300],
//       align: 'center',
//       valign: 'center'
//     });

//     doc.end();
//   } catch (err) {
//     next(err);
//   }
// });

// // ───── Excel Export ─────
// router.get('/participation/excel', async (req, res, next) => {
//   try {
//     const data = await getParticipationData();

//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Participation Report');

//     sheet.columns = [
//       { header: 'Month', key: 'month', width: 15 },
//       { header: 'Cleanups', key: 'cleanups', width: 15 },
//       { header: 'Feedback', key: 'feedback', width: 15 }
//     ];

//     data.cleanupsByMonth.forEach((c) => {
//       const f = data.feedbackByMonth.find(fb => fb._id === c._id);
//       sheet.addRow({
//         month: c._id,
//         cleanups: c.count,
//         feedback: f ? f.count : 0
//       });
//     });

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename=participation-report.xlsx');

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (err) {
//     next(err);
//   }
// });

// // ───── Data Fetcher ─────
// async function getParticipationData() {
//   const Cleanup = require('../models/Cleanup');
//   const Feedback = require('../models/Feedback');

//   const cleanupsByMonth = await Cleanup.aggregate([
//     { $match: { status: { $in: ['approved', 'completed'] } } },
//     { $group: {
//         _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//         count: { $sum: 1 }
//     }},
//     { $sort: { _id: 1 } }
//   ]);

//   const feedbackByMonth = await Feedback.aggregate([
//     { $group: {
//         _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
//         count: { $sum: 1 }
//     }},
//     { $sort: { _id: 1 } }
//   ]);

//   return { cleanupsByMonth, feedbackByMonth };
// }

// module.exports = router;











// sabirin updated the code
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

const Cleanup = require('../models/Cleanup');
const Feedback = require('../models/Feedback');

// Chart config
const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// ───── Standard Report Routes ─────
router.get('/participation', participation);
router.get('/waste-analysis', wasteAnalysis);
router.get('/district-performance', districtPerformance);

// ───── Total Cleanups Completed ─────
router.get('/total-cleanups-completed', async (req, res, next) => {
  try {
    const totalCompleted = await Cleanup.countDocuments({ status: 'completed' });
    res.json({ success: true, totalCompleted });
  } catch (err) {
    next(err);
  }
});

router.get('/total-cleanups-completed/pdf', async (req, res, next) => {
  try {
    const totalCompleted = await Cleanup.countDocuments({ status: 'completed' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=total-cleanups-completed.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Total Cleanups Completed', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Total Completed Cleanups: ${totalCompleted}`);

    doc.end();
  } catch (err) {
    next(err);
  }
});

router.get('/total-cleanups-completed/excel', async (req, res, next) => {
  try {
    const totalCompleted = await Cleanup.countDocuments({ status: 'completed' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Total Cleanups');

    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    sheet.addRow({ metric: 'Total Cleanups Completed', value: totalCompleted });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=total-cleanups-completed.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

// ───── Waste Analysis PDF Export (using Cleanup.wasteType) ─────
router.get('/waste-analysis/pdf', async (req, res, next) => {
  try {
    const wasteData = await Cleanup.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=waste-analysis.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Waste Type Analysis Report', { align: 'center' });
    doc.moveDown();

    wasteData.forEach(waste => {
      doc.fontSize(14).text(`${waste._id}: ${waste.count}`);
    });

    doc.end();
  } catch (err) {
    next(err);
  }
});

// ───── Waste Analysis Excel Export (using Cleanup.wasteType) ─────
router.get('/waste-analysis/excel', async (req, res, next) => {
  try {
    const wasteData = await Cleanup.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Waste Analysis');

    sheet.columns = [
      { header: 'Waste Type', key: 'type', width: 30 },
      { header: 'Count', key: 'count', width: 15 }
    ];

    wasteData.forEach(item => {
      sheet.addRow({ type: item._id, count: item.count });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=waste-analysis.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

// ───── Participation PDF ─────
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

// ───── Participation Excel ─────
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

// ───── Helper ─────
async function getParticipationData() {
  const cleanupsByMonth = await Cleanup.aggregate([
    { $match: { status: { $in: ['approved', 'completed'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const feedbackByMonth = await Feedback.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return { cleanupsByMonth, feedbackByMonth };
}

module.exports = router;
