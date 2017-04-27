function importData() {
	var fSource = DriveApp.getFolderById("0B9VAL2jjUYejOTc5QUpIRGNaclE"); // reports_folder_id = id of folder where csv reports are saved
	var allFiles = fSource.getFiles()
	
	while (allFiles.hasNext()) {
		var file = allFiles.next();
		var fileName = file.getName()
		
		if (fileName.indexOf("###") > -1) {
			continue;
		} else {
			processFile(file)
		}
	}
}

function processFile(fi){ 
	var ss = SpreadsheetApp.openById("1VXZ3TxdI4pmT2G42mFHXUo5JemJsklFUFBplqeu1Byo"); // data_sheet_id = id of spreadsheet that holds the data to be updated with new report data

	if (fi) { // proceed if file exists
		var csv = fi.getBlob().getDataAsString();
		var csvData = [csv.split(",")];
		
		var happinessSheet = ss.getSheetByName("Sheet1")
		
		//Get date and calculate the days elapsed to figure out row index
		var currentDate = csvData[0][0].split("/");
		var dd = currentDate[1];
		var mm = currentDate[0]-1;
		var today = new Date();
		//var dd = today.getDate();
		//var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		 
		//adjust to fit dd/mm format
		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		}
		
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		var firstDate = new Date(2017,03,24);
		var secondDate = new Date(yyyy,mm,dd);
		firstDate.setHours(0,0,0); 
		secondDate.setHours(0,0,0);
		
		var days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))) + 1;
		
		// current # days elapsed + # of completed weeks + header 
		var rowIndex = days + (( (days-1) - ((days-1)%7) )/7) + 1

		//change daysElapsed cell
		happinessSheet.getRange(3,11,1,1).setValue([days]);
		//change rowIndex cell
		happinessSheet.getRange(3,12,1,1).setValue([rowIndex]);
		
		//set row according to count
		happinessSheet.getRange(rowIndex,1,1,8).setValues([[csvData[0][0],csvData[0][1],csvData[0][2],csvData[0][3],csvData[0][4],csvData[0][5],csvData[0][6],csvData[0][7]]])
		
		// rename the report.csv file so it is not processed on next scheduled run
		fi.setName("###"+(new Date().toString())+".csv");
	}
};