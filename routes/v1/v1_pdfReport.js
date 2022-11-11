var express = require('../../lib/node_modules/express');
var jwt = require('../../lib/node_modules/jsonwebtoken');

var app = express();
var fs = require("fs");
var router = express.Router();

//using privatekey
var cert=fs.readFileSync('private.pem');

//htmltopdf
var puppeteer = require("../../lib/node_modules/puppeteer");

//custom jwt module
var jwtModule = require('../lib/jwtToken');
const status = require('../lib/status');
const log = require('../lib/log');
const dbQuery = require('../lib/dbQuery');
const properties = require('../lib/properties');

//api keys
const scope = require('../lib/apiKeys');
const api_key = scope.learningApi.apiKey;
const api_secret = scope.learningApi.apiSecret;

//get current path
//console.log(process.cwd());

router.post('/',function(req,res,next) {
   var rtoken = req.body.token || req.query.token || req.headers['x-access-token'];
    const apiKey = req.body.api_key;
    const apiSecret=req.body.api_secret;

    if ((!apiKey || !apiSecret)){
        res.send(JSON.parse(status.unAuthApi()));
    } else if ((apiKey != api_key) && (apiSecret != api_secret)) {
        res.send(JSON.parse(status.unAuthApi()));
   	} else {
	   if (rtoken) {

			jwtModule.jwtVerify(rtoken,function(callback){
				if (callback) {
					jwtModule.jwtGetUserId(rtoken,function(callbackUser){
						const userId=callbackUser.userId
						const userUniqId=callbackUser.uniqId
						dbQuery.getSelect(dbQuery.whereOnlineStatus,[userId],function (callbackOnline){
							//if (!callbackOnline[0]) {
							if (!callbackOnline[0]) {
								res.send(JSON.parse(status.server()));
							/*
							} else if (callbackOnline[0].status == 'online'){
								res.send(JSON.parse(status.notAllowLogin()));
							} else if (callbackOnline[0].status == 'offline'){
								res.send(JSON.parse(status.stateSuccess(contents)));
							*/
							} else {
								/* create html */
								//var htmlPath = 'routes/templates/'+userUniqId+'.html';
								var htmlPath = '/data/pdfReports/'+userUniqId+'.html';
								var pdfPath = '/data/pdfReports/'+userUniqId+'.pdf';
								try {

									dbQuery.getWeeklyPdfReport(dbQuery.weeklyReport,[userId],function (callbackReport){
										if (callbackReport){
											//console.log("pdfCreation: "+callbackReport);
											const rows = JSON.parse(callbackReport).map(createRow).join('');
											const table = createTable(rows);
											//console.log("rows :"+rows);
											dbQuery.getReportInfo(dbQuery.profileInfo,[userId,userId],function(callbackInfo){
												const reportData = JSON.parse(callbackInfo);
												const dateToday = new Date();
												if (reportData){
													//console.log(reportData.personalInfo);
													//console.log(reportData.activityList);
													const html = createHtml(table,reportData.personalInfo,reportData.activityList,dateToday.getFullYear()+"-"+(dateToday.getMonth()+1)+"-"+dateToday.getDate());
													fs.writeFileSync(htmlPath,html);
													console.log("Successfully created an html page");
												}
											});


											(async () => {
											  const browser = await puppeteer.launch();

											  // Create a new page
											  const page = await browser.newPage();

											  //Get HTML content from HTML file
											  const html = fs.readFileSync(htmlPath, 'utf-8');
											  await page.setContent(html, { waitUntil: 'domcontentloaded' });

											  // To reflect CSS used for screens instead of print
											  await page.emulateMediaType('screen');

											  // Downlaod the PDF
											  const pdf = await page.pdf({
											    //path: '/data/pdfReports/'+userUniqId+'.pdf',
											    path: pdfPath,
											    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
											    printBackground: true,
											    format: 'A4',
											  });
											  // Close the browser instance
											  await browser.close();
												//res.setHeader("Content-Type", "text/pdf");
												//res.send(pdf);
												//res.send(callbackReport);
												try {
													//var pdfData =fs.readFileSync('/data/pdfReports/'+userUniqId+'.pdf');
													var pdfData =fs.readFileSync(pdfPath);
													if (doesFileExist(htmlPath)){
														//console.log(htmlPath+" deleted");
														fs.unlinkSync(htmlPath);
													}
													if (doesFileExist(pdfPath)){
														//console.log(pdfPath+" deleted");
														fs.unlinkSync(pdfPath);
													}
													res.setHeader("Content-Type", "application/pdf");
													res.send(pdfData);
												} catch(e) {
													console.log(userUniqId+".pdf Weekly report pdf not found in directory");
												}
											})();
										}
									});

								} catch (e) {
									console.log("Error generating html file",e);
								}
								// Create a browser instance



							}
						});

					});
				} else {
					res.send(JSON.parse(status.tokenExpired()));
				}
			});

	    } else {
	       res.send(JSON.parse(status.tokenNone()));
	 }
   }

 });

const createTable = (rows) => `
<table border="1">
	<tr>
		<th>Subjects</th>
		<th>Sunday</th>
		<th>Monday</th>
		<th>Tuesday</th>
		<th>Wednsday</th>
		<th>Thursday</th>
		<th>Friday</th>
		<th>Saturday</th>
	</tr>
	${rows}
</table>
`;

//${items.}
const createRow = (items) => `
<tr>
	<td>${items.subject}</td>
	<td>${items.results[0].totalLessons}</td>
	<td>${items.results[1].totalLessons}</td>
	<td>${items.results[2].totalLessons}</td>
	<td>${items.results[3].totalLessons}</td>
	<td>${items.results[4].totalLessons}</td>
	<td>${items.results[5].totalLessons}</td>
	<td>${items.results[6].totalLessons}</td>
</tr>
`;

const createHtml = (table,info,activity,dateNow) => `
<html>
	<head>
	<style>
		table {
		  border-collapse: collapse;
		}

		th,td {
			padding:10px;
			text-align:center;
		}
	</style>
	</head>
	<body>
		<center><h2>Study Buddy - Weekly Report</h2></center>
		<p>Name : ${info.studentName}</p>
		<p>Grade : ${info.studentGrade}</p>
		<p>School : ${info.school}</p>
		<p>Date : ${dateNow}</p>
		<p>Completed Lessons : ${activity.totalLessons}</p>
		<p>Correct Answers : ${activity.correctAnswers}</p>
		${table}
	</body>
</html>

`;

const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath);
		return true;
	} catch(e) {
		return false;
	}
};

module.exports = router
