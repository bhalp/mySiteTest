var gbIsIE = false;
var gCRLF = /\n/g;
var gsCRLF = "\n";

if (navigator.appName == "Microsoft Internet Explorer")
{
    gbIsIE = true;
    gCRLF = /\r\n/g;
    gsCRLF = "\r\n";
}

function AreYouSure (sMsg)
{
    var sTmp = typeof sMsg !== 'undefined' ? sMsg : "";
    
    return (window.confirm(sTmp + "Are you sure?"));
}

function CancelKeyStroke (ev)
{
var e;
	try
	{
		ev.keyCode = 0;
		ev.cancelBubble = true;
		ev.returnValue = false;
		return (true);
	}
	catch (e)
	{
		return (false)
	}					
}

function FitTextToArea(sArea, sText, sFontFamily, sFontSize, sFontWeight, iInMaxWidth)
{
var iMaxWidth = 0;
var iLen
var idx = 0;
var sReturn = "";
var numArgs = arguments.length;
	
	if (sText.length > 0)
	{
		if (numArgs > 5)
		{
			iMaxWidth = iInMaxWidth;
		}
		else
		{
			iMaxWidth = document.getElementById(sArea).style.pixelWidth + 30;
		}
		iLen = GetTextWidth (document.Search.Picture1, sFontFamily, sFontSize, sFontWeight, sText);
		if (iLen > iMaxWidth) //need to truncate ?
		{
			for (idx = sText.length; idx > 0; idx = idx - 1)
			{
				iLen = GetTextWidth (document.Search.Picture1, sFontFamily, sFontSize, sFontWeight, sText.substr(0,idx));
				if (iLen <= iMaxWidth) //done truncating ?
				{
					sReturn = sText.substr(0,idx)
					break;
				}
			}
		}
		else //dont need to truncate
		{
			sReturn = sText;
		}
	}
	return (sReturn)
}

function FormatDecimalNumber(dNum, iDecimalDigitsLeft, iDecimalDigitsRight, sLeftFill) {
	return FormatDecimalNumberRightTrim(dNum, iDecimalDigitsLeft, iDecimalDigitsRight, sLeftFill, false);
}

function FormatDecimalNumberRightTrim(dNum, iDecimalDigitsLeft, iDecimalDigitsRight, sLeftFill, bRightTrim)
{
	let dTmp = 0;
	let vTmp;
	let sTmp = "";
	let sLeft = "";
	let sRight = "";
	let idx = 0;
	let sReturn = "";
	let bNeedToAddDash = false;
//	dTmp = RoundLikeVB(dNum, iDecimalDigitsRight)
	dTmp = dNum.toFixed(iDecimalDigitsRight);  //11/25/20 changed to use toFixed to fix rounding problem for numbers like 0.045
	if ((dNum < 0) && (dTmp == 0)) {
		dTmp = 0;
	}
	if (dTmp < 0) {
		dTmp = -1 * dTmp;
		bNeedToAddDash = true;
    }

	sTmp = dTmp.toString();
	vTmp = sTmp.split(".");
	if (vTmp.length == 1)
	{
		sLeft = vTmp[0];
		if (vTmp[0].length < iDecimalDigitsLeft)
		{
			for (idx = 0; idx < iDecimalDigitsLeft - vTmp[0].length; idx++)
			{
				sLeft = sLeftFill + sLeft;
			}
		}
		sRight = "";
		for (idx = 0; idx < iDecimalDigitsRight; idx++)
		{
			sRight = sRight + "0";
		}
	}
	else
	{
		sLeft = vTmp[0];
		if (vTmp[0].length < iDecimalDigitsLeft)
		{
			for (idx = 0; idx < iDecimalDigitsLeft - vTmp[0].length; idx++)
			{
				sLeft = sLeftFill + sLeft;
			}
		}
		sRight = vTmp[1];
		if (vTmp[1].length < iDecimalDigitsRight) {
			for (idx = 0; idx < iDecimalDigitsRight - vTmp[1].length; idx++) {
				sRight = sRight + "0";
			}
		}
		if (bRightTrim) 
		{
			for (idx = sRight.length - 1; idx > -1; idx--)
			{
				if (sRight.substr(idx, 1) != 0) {
					break;
                }
			}
			if (idx > -1) {
				sRight = sRight.substr(0, idx + 1);
			} else {
				sRight = "0";
            }
		}
	}
	if (sRight == "") {
		sReturn = sLeft;
	} else {
		sReturn = sLeft + "." + sRight;
	}
	if (bNeedToAddDash) {
		sReturn = "-" + sReturn;
    }
	return (sReturn);
}

function FormatCurrentDate ()
{
var d = new Date();                           //Create Date object.
var iMonth = d.getMonth() + 1;
var iDay = d.getDate();
var iYear = d.getYear();
    if (iYear < 1900)
    {
        iYear += 1900;
    }
    return (iMonth.toString() + "/" + iDay.toString() + "/" + iYear.toString());
}

function FormatCurrentDateTime ()
{
var s = "";           //Declare variables.
var sAMPM= "AM";
var sHours = "";
var d = new Date();                           //Create Date object.
var iMonth = d.getMonth() + 1;
var iDay = d.getDate();
var iYear = d.getYear();
var iHours = d.getHours();
var iMinutes = d.getMinutes();
var iSeconds = d.getSeconds();
var iMilliSeconds = d.getMilliseconds();

    if (iYear < 1900)
    {
        iYear += 1900;
    }

    if (iMonth > 9)
    {
        s += iMonth + "/";            //Get month
    }
    else
    {
        s += "0" + iMonth + "/";            //Get month
    }
    if (iDay > 9)
    {
        s += iDay + "/";                   //Get day
    }
    else
    {
        s += "0" + iDay + "/";                   //Get day
    }
    s += iYear + " ";                         //Get year.
    
    if (iHours > 11)
    {
        sAMPM= "PM";
        iHours = iHours - 12;
    }
    if (iHours == 0)
    {
        sHours = "12";
    }
    else
    {
        sHours = "0" + iHours;
    }
    
    s += sHours + ":";

    if (iMinutes > 9)
    {
        s += iMinutes + ":";
    }
    else
    {
        s += "0" + iMinutes + ":";
    }

    if (iSeconds > 9)
    {
        s += iSeconds + ":";
    }
    else
    {
        s += "0" + iSeconds + ".";
    }

    iMilliSeconds = d.getMilliseconds();
    if (iMilliSeconds < 10)
    {
        s += "00" + d.getMilliseconds() + " " + sAMPM;
    }
    else if (iMilliSeconds < 100)
    {
        s += "0" + d.getMilliseconds() + " " + sAMPM;
    }
    else
    {
        s += d.getMilliseconds() + " " + sAMPM;
    }
    return (s);
}

function FormatCurrentDateForTD() {
	var s = "";           //Declare variables.
	var d = new Date();                           //Create Date object.
	var iMonth = d.getMonth() + 1;
	var iDay = d.getDate();
	var iYear = d.getYear();

	if (iYear < 1900) {
		iYear += 1900;
	}

	s += iYear + "-";                         //Get year.

	if (iMonth > 9) {
		s += iMonth + "-";            //Get month
	}
	else {
		s += "0" + iMonth + "-";            //Get month
	}
	if (iDay > 9) {
		s += iDay;                   //Get day
	}
	else {
		s += "0" + iDay;                   //Get day
	}
	return (s);
}

function FormatDate (d)
{
var iMonth = d.getMonth() + 1;
var iDay = d.getDate();
var iYear = d.getYear();
    if (iYear < 1900)
    {
        iYear += 1900;
    }
    return (iMonth.toString() + "/" + iDay.toString() + "/" + iYear.toString());
}

function FormatDateWithTime(d, bIncludeSeconds, bIncludeMilliseconds) {
	var s = "";           //Declare variables.
	var iMonth = d.getMonth() + 1;
	var iDay = d.getDate();
	var iYear = d.getYear();
	var iHours = d.getHours();
	var iMinutes = d.getMinutes();
	var iSeconds = d.getSeconds();
	var iMilliSeconds = d.getMilliseconds();

	if (iYear < 1900) {
		iYear += 1900;
	}

	if (iMonth > 9) {
		s += iMonth + "/";            //Get month
	}
	else {
		s += "0" + iMonth + "/";            //Get month
	}
	if (iDay > 9) {
		s += iDay + "/";                   //Get day
	}
	else {
		s += "0" + iDay + "/";                   //Get day
	}
	s += iYear + " ";                         //Get year.

	if (iHours > 9) {
		s += iHours + ":";
	}
	else {
		s += "0" + iHours + ":";
	}

	if (iMinutes > 9) {
		s += iMinutes;
	}
	else {
		s += "0" + iMinutes;
	}

	if ((bIncludeSeconds) || (bIncludeMilliseconds)) {
		s += ":"
		if (iSeconds > 9) {
			s = s + iSeconds;
		}
		else {
			s = s + "0" + iSeconds;
		}
		if (bIncludeMilliseconds) {
			s += "."
			iMilliSeconds = d.getMilliseconds();
			if (iMilliSeconds < 10) {
				s += "00" + d.getMilliseconds();
			}
			else if (iMilliSeconds < 100) {
				s += "0" + d.getMilliseconds();
			}
			else {
				s += d.getMilliseconds();
			}
		}
    }

	return s;
}


function FormatInt(amount) {
	var decimalCount = 0;
	var decimal = "";
	var thousands = ",";
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e);
	}
	return "";
}

function FormatIntegerNumber(iNum, iDecimalDigitsLeft, sLeftFill)
{
var numArgs = arguments.length;
var sTmp = "";
var sLeft = "";
var idx = 0;
	sTmp = iNum.toString();
    sLeft = sTmp;
	if (sTmp.length < iDecimalDigitsLeft)
	{
		for (idx = 0; idx < iDecimalDigitsLeft - sTmp.length; idx++)
		{
			sLeft = sLeftFill + sLeft;
		}
	}
	return sLeft;
}

function FormatMoney(amount) {
	var decimalCount = 2;
	var decimal = ".";
	var thousands = ",";
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e);
	}
	return "";
}

function FormatTDTradeDate(d, bShowTimeIn, bShowESTUTCIn) {
	let s = "";           //Declare variables.
	let sHours = "";

	let iMonth = 0;
	let iDay = 0;
	let iYear = 0;
	let iHours = 0;
	let iMinutes = 0;
	let iSeconds = 0;

	let bShowTime = true;
	let bShowESTUTC = false;

	if (!isUndefined(bShowTimeIn)) {
		bShowTime = bShowTimeIn;
    }

	if (!isUndefined(bShowESTUTCIn)) {
		bShowESTUTC = bShowESTUTCIn;
	}

	if (bShowESTUTC) {
		iMonth = d.getUTCMonth() + 1;
		iDay = d.getUTCDate();
		iYear = d.getUTCFullYear();
		iHours = d.getUTCHours();
		iMinutes = d.getUTCMinutes();
		iSeconds = d.getUTCSeconds();
	} else {
		iMonth = d.getMonth() + 1;
		iDay = d.getDate();
		iYear = d.getYear();
		iHours = d.getHours();
		iMinutes = d.getMinutes();
		iSeconds = d.getSeconds();
    }

	if (iYear < 1900) {
		iYear += 1900;
	}

	if (iMonth > 9) {
		s += iMonth + "/";            //Get month
	}
	else {
		s += "0" + iMonth + "/";            //Get month
	}
	if (iDay > 9) {
		s += iDay + "/";                   //Get day
	}
	else {
		s += "0" + iDay + "/";                   //Get day
	}
	s += iYear;                         //Get year.

	if (bShowTime) {
		s += " ";
		if (iHours < 10) {
			sHours = "0" + iHours;
		} else {
			sHours = iHours;
		}

		s += sHours + ":";

		if (iMinutes > 9) {
			s += iMinutes + ":";
		}
		else {
			s += "0" + iMinutes + ":";
		}

		if (iSeconds > 9) {
			s += iSeconds;
		}
		else {
			s += "0" + iSeconds;
		}
    }

	return (s);
}

function GetTDMillisecondTime(sDate) {
	//sDate shoule be like 4/1/2020
	var d = new Date(sDate);
	var n = d.getTime();
	return n;
}

function GetStartPos(sInResponseText)
{
var iStartPos=0;
var responseText = "";
var e;
	responseText = sInResponseText;
	try
	{
		//need to remove the <?xml and <!DOCTYPE elements
		if (responseText.substr(0,5) == "<?xml")
		{
		    iStartPos = responseText.indexOf(">");
		    if (iStartPos == -1)
		    {
				iStartPos = 0;
		    }
		    else
		    {
				if (responseText.substr(iStartPos + 1,9) == "<!DOCTYPE")
				{
					iStartPos = responseText.indexOf(">", iStartPos + 1);
					if (iStartPos == -1)
					{
						iStartPos = 0;
					}
					else
					{
						iStartPos = iStartPos + 1;
					}
				}
				else
				{
					iStartPos = iStartPos + 1;
				}
			}
		}
		else
		{
		    iStartPos = 0;
		}
	}
	catch (e)
	{
	    iStartPos = 0;
	}
	return (iStartPos);
}

function IsAllNumeric(s)
{
	for (var i = 0; i < s.length; i++)
	{
		var c = s.charAt(i);
		if ((c < '0') || (c > '9')) return false;
	}

	return true;
}

function IsAllNonNumeric(s)
{
	for (var i = 0; i < s.length; i++)
	{
		var c = s.charAt(i);
		if ((c >= '0') && (c <= '9')) return false;
	}

	return true;
}

function IsBlank(s)
{
	for (var i = 0; i < s.length; i++)
	{
		var c = s.charAt(i);
		if ((c != ' ') && (c != '\n') && (c != '\t')) return false;
	}

	return true;
}

function ltrim(s) //remove spaces from the left
{
	var sData = "";

    if (s.length > 0)
    {
	    for (var i = 0; i < s.length; i++)
	    {
		    var c = s.charAt(i);
		    if (c != ' ') 
            {
                sData = s.substr(i);
                break;
            }
	    }
    }
	return sData;
}

function MyHTMLEncode(sData)
{
var re;
var sTmp = "";
	re = /&/g;
	sTmp = sData.replace(re,"&amp;")
	re = />/g;
	sTmp = sTmp.replace(re,"&gt;")
	re = /</g;
	sTmp = sTmp.replace(re,"&lt;")
	re = /"/g;
	sTmp = sTmp.replace(re,"&quot;")
	re = /'/g;
	sTmp = sTmp.replace(re,"&apos;")
	return (sTmp);
}

function oHTTP()
{
    // http object
    if (window.ActiveXObject)
    {// code for IE5 and IE6
        return (new ActiveXObject("microsoft.XMLHTTP"));
    }
    else if (window.XMLHttpRequest)
    {// code for all new browsers
        return (new XMLHttpRequest());
    }
}

function Replace_SpecialChar(strInput)
{
	var strOutput = "";
    var re;

	strOutput = strInput;
    
	if (strOutput != "")
    {
        re = /%/g;
        strOutput = strOutput.replace(re,"/pctxxx");
        re = /&/g;
        strOutput = strOutput.replace(re,"/ampxxx");
        re = /</g;
        strOutput = strOutput.replace(re,"/ltxxx");
        re = />/g;
        strOutput = strOutput.replace(re,"/gtxxx");
        re = /\"/g;
        strOutput = strOutput.replace(re,"/quotxxx");
        re = /\'/g;
        strOutput = strOutput.replace(re,"/aposxxx");
    
	}
	return (strOutput);
}

function Replace_XMLChar(strInput)
{
	var strOutput = "";
    var re;

	strOutput = strInput;
    
	if (strOutput != "")
    {
        re = /&/g;
        strOutput = strOutput.replace(re,"&amp;");
        re = /</g;
        strOutput = strOutput.replace(re,"&lt;");
        re = />/g;
        strOutput = strOutput.replace(re,"&gt;");
        re = /\"/g;
        strOutput = strOutput.replace(re,"&quot;");
        re = /\'/g;
        strOutput = strOutput.replace(re,"&apos;");
    
	}
	return (strOutput);
}

function RoundLikeVB(dNum, iDecimalDigits)
{
var numArgs = arguments.length;
var dTmp = 0;
var sTmp = "";
	if (numArgs == 1)
	{
		return (Math.round(dNum))
	}
	else
	{
		if (iDecimalDigits > 1)
		{
			dTmp = Math.floor(Math.abs(dNum))
            if (dTmp == 0)
            {
			    sTmp = "";
            }
            else
            {
			    sTmp = dTmp.toString();
			}
			return(dNum.toPrecision(sTmp.length + iDecimalDigits))
		}
		else
		{
			return (Math.round(dNum))
		}
	}
}

function Trim(s) //removes all spaces
{
	var sData = "";
	
	for (var i = 0; i < s.length; i++)
	{
		var c = s.charAt(i);
		if (c != ' ') sData = sData + c;
	}

	return sData;
}

function TrimLikeVB(s) //removes all spaces from beginning and end and multiple spaces in the middle
{
	var sData = "";
	var bGotFirstNonBlank = false;
	var bFoundSpace = false;
	
	if (s != null)
	{
		for (var i = 0; i < s.length; i++)
		{
			var c = s.charAt(i);
			if (c == " ")
			{
				if (bGotFirstNonBlank)
				{
					bFoundSpace = true;
				}
			}
			else
			{
				bGotFirstNonBlank = true;
				if (bFoundSpace)
				{
					bFoundSpace = false;
					sData = sData + " " + c;
				}
				else
				{
					sData = sData + c;
				}
			}
		}
	}
	return sData;
}

function UpperCaseTrim(sData)
{
    var sTmp = TrimLikeVB (sData);
    if (sTmp.length > 0)
    {
        sTmp = sTmp.toUpperCase();
    }
    return (sTmp);
}

function UnReplace_SpecialChar(strInput)
{
	var strOutput = "";
    var re;

	strOutput = strInput;
    
	if (strOutput != "")
    {
        re = /\/pctxxx/g;
        strOutput = strOutput.replace(re,"%");
        re = /\/ampxxx/g;
        strOutput = strOutput.replace(re,"&");
        re = /\/ltxxx/g;
        strOutput = strOutput.replace(re,"<");
        re = /\/gtxxx/g;
        strOutput = strOutput.replace(re,">");
        re = /\/quotxxx/g;
        strOutput = strOutput.replace(re,"\"");
        re = /\/aposxxx/g;
        strOutput = strOutput.replace(re,"'");
    
	}
	return (strOutput);
}

function UnReplace_XMLChar(strInput)
{
	var strOutput = "";
    var re;

	strOutput = strInput;
    
	if (strOutput != "")
    {
        re = /&amp;/g;
        strOutput = strOutput.replace(re,"&");
        re = /&lt;</g;
        strOutput = strOutput.replace(re,"<");
        re = /&gt;/g;
        strOutput = strOutput.replace(re,">");
        re = /&quot;/g;
        strOutput = strOutput.replace(re,"\"");
        re = /&apos;/g;
        strOutput = strOutput.replace(re,"'");
    
	}
	return (strOutput);
}


