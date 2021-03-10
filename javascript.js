// INVEST!
// setupConfiguration() used to setup default configurable items
// getProfileData() used to retrieve member profile and account data from Ally Invest API server side PHP http request.
// getAccountData() used to retrieve account data from Ally Invest API through server side PHP http request.  
// accountAggregator(accountObj) used to handle json array of accounts into html
// refreshAccountInterval() used to refresh data from quotes for each interval

//alertReview() reviews each alerts to determine if it should be fired
//alertUpdateQueue() queue system for updating alert data back to server
//getWatchLists() gets watchlist data and builds tables

// *** Helpful References, search for these keywords *** //
// SETUP_EXTRA_ACCOUNTS - If using any Non Ally Invest accounts, make sure to update
// SETUP_EXTERNAL_LINKS - section used for adding external links to each holding/watchlist record.

var getDataInterval;

function showCheckboxes() {
	document.getElementById("checkboxes").style.display = "block";
}
function hideCheckboxes() {
	let count = selectedAccounts().length;
	if (count == 0) {
		document.getElementById("multiselect-txt").innerText = "Select accounts";
	} else if (count == 1) {
		document.getElementById("multiselect-txt").innerText = "1 account selected";
	} else if (count > 1) {
		document.getElementById("multiselect-txt").innerText = count + " accounts selected";
	}	
	document.getElementById("checkboxes").style.display = "none";
}

function accountsSelected() {
	document.getElementById("account-select").classList.add("changed");
	
	var accounts = [];
	var elms = document.getElementsByName("accountNumber");	
	for (i = 0; i < elms.length; i++) {
		if (elms[i].checked) {
			accounts.push(elms[i].value);
		}
	}
	localStoreObjectSet("selected_accounts", accounts);
}

function clearAccountsSelected() {
	document.getElementById("account-select").classList.remove("changed");
}

function accountsChanged() {
	let elm = document.getElementById("account-select");
	if (elm.classList.contains("changed")) {
		return true;
	} else {
		return false;
	}
}

function toggleExternalLinks() {
	var elms = document.getElementsByClassName("ext-links");
	for (i = 0; i < elms.length; i++) {
		if (elms[i].classList.contains("ninja")) {
			elms[i].classList.remove("ninja");
		} else {
			elms[i].classList.add("ninja");
		}
	}
}

function toggleExternalChart() {
	var elms = document.getElementsByClassName("ext-chart");
	for (i = 0; i < elms.length; i++) {
		if (elms[i].classList.contains("ninja")) {
			elms[i].classList.remove("ninja");
		} else {
			elms[i].classList.add("ninja");
		}
	}
}

function toggleExternalBadges() {
	var elms = document.getElementsByClassName("ext-badges");
	for (i = 0; i < elms.length; i++) {
		if (elms[i].classList.contains("ninja")) {
			elms[i].classList.remove("ninja");
		} else {
			elms[i].classList.add("ninja");
		}
	}
}

function alertTriggerChange(elm, idPrefix) {
	let target = elm.value;
	let targetValueElm = document.getElementById(idPrefix + "alert_target");
	let td = elm.parentElement.nextElementSibling;
	let holding;
	if (idPrefix == "") {
		holding = document.getElementById("alert_symbol").value;
	} else {
		holding = document.getElementById(idPrefix + "holding").value;
	}
	
	// setup condition
	if (target == "trailloss") {
		td.innerHTML = '<input type="number" id="' + idPrefix + 'alert_condition" name="alert_condition" placeholder="Trailing Dollar Amount">';
	} else if (target == "trailpercent") {
		td.innerHTML = '<input type="number" id="' + idPrefix + 'alert_condition" name="alert_condition" placeholder="Trailing Percent">';
	} else {
		td.innerHTML = '<select id="' + idPrefix + 'alert_condition" name="alert_condition">' + 
			'<option value="greater">Greater (&gt;=)</option>' + 
			'<option value="less">Less (&lt;=)</option>' + 
			'</select>';		
	}
	
	// set default target value
	if (target == "trailloss" || target == "trailpercent") {
		if (holding) {
			targetValueElm.value = parseFloat( document.getElementById("trid_" + holding).getAttribute("lastprice") );
		}
	} else if (target == "date") {
		targetValueElm.value = DateToString(new Date());
	} else {
		if (holding) {
			targetValueElm.value = parseFloat( document.getElementById("trid_" + holding).getAttribute(target) );
		}
	}
	
}

function loaderOn(callback, tblID, n, type) {
	document.getElementById('processing').style.display = 'block';
	if (callback instanceof Function) {
		setTimeout(function(){
			document.getElementById('processing').style.display = 'block';
			tblSort(tblID, n, type);
		}, 1);			
	}
}

function loaderOff() {
	document.getElementById('processing').style.display = 'none';
}

function toggleModal(id) {
	if (document.getElementById(id).style.display == "none") {
		document.getElementById(id).style.display = "block";
	} else {
		document.getElementById(id).style.display = "none";
	}
}

function toggleTBody(elm, tableID) {
	let tbody = document.getElementById(tableID).getElementsByTagName("tbody")[0];
	if (elm.classList.contains("fa-chevron-circle-right")) {
		elm.classList.remove("fa-chevron-circle-right");
		elm.classList.add("fa-chevron-circle-down")
		tbody.classList.remove("ninja");
	} else {
		elm.classList.remove("fa-chevron-circle-down");
		elm.classList.add("fa-chevron-circle-right")
		tbody.classList.add("ninja");
	}
}

function guid() {
    // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function indexOfArray(arr, field, value) {
	for (i = 0; i < arr.length; i++) {
		if (arr[i][field] == value) {
			return i;
		}
	}
	return -1;
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function dropOpt(ev) {
	ev.preventDefault();
	let data = ev.dataTransfer.getData("text");
	ev.target.insertAdjacentElement("afterend", document.getElementById(data));
	setHoldingColumns();
}

function setHoldingColumns() {
	let chart_columns = document.getElementById("config_holding_columns").getElementsByTagName("input");
	let chart_columns_arr = [{"name":"holdings","display":true},{"name":"badges","display":true}];
	for (i = 0; i < chart_columns.length; i++) {
		let column = {"name": chart_columns[i].value, "display": chart_columns[i].checked};
		chart_columns_arr.push(column);
	}
	localStoreObjectSet("chart_columns", chart_columns_arr);
}

function setExternalLinks() {
	let external_links = document.getElementById("config_external_links").getElementsByTagName("input");
	let external_links_arr = [];
	for (i = 0; i < external_links.length; i++) {
		let item = {"name": external_links[i].value, "display": external_links[i].checked};
		external_links_arr.push(item);
	}
	localStoreObjectSet("external_links", external_links_arr);	
}

function setupConfiguration() {
	// setup configurable item values
	
	// Default Mini Chart Interval
	let chart_int = document.getElementById("config_chart_int");
	chart_int.onchange = function(){
		localStorage.setItem("chart_interval", this.value);
	};

	if (localStorage.getItem("chart_interval") !== null) {
		chart_int.value = localStorage.getItem("chart_interval");
	} else {
		chart_int.value = "1M";
		localStorage.setItem("chart_interval", chart_int.value);
	}	
	
	// Default Holdings Column Layout
	let chart_columns_arr;
	let chart_columns = document.getElementById("config_holding_columns");
	if (localStorage.getItem("chart_columns") !== null) {
		chart_columns_arr = localStoreObjectGet("chart_columns");	
	} else {
		chart_columns_arr = [{"name":"holdings","display":true},{"name":"badges","display":true},{"name":"chart","display":true},{"name":"qty","display":true},{"name":"lastprice","display":true},{"name":"change","display":true},{"name":"percent","display":true},{"name":"marketvalue","display":true},{"name":"costbasis","display":true},{"name":"avgcost","display":true},{"name":"gainloss","display":true},{"name":"gainpercent","display":true},{"name":"% of account","display":true},{"name":"external links","display":true}];
		localStoreObjectSet("chart_columns", chart_columns_arr);
	}
	for (var i = 2; i < chart_columns_arr.length; i++) {
		let isChecked = "";
		if (chart_columns_arr[i].display) {isChecked = " checked";}
		let txt = '<label id="lbl_c_chc' + i + '" for="c_chc' + i + '1" draggable="true" ondragstart="drag(event)" ondrop="dropOpt(event)" ondragover="allowDrop(event)">' +
		'<input type="checkbox" id="c_chc' + i + '" onchange="setHoldingColumns();" value="' + chart_columns_arr[i].name + '" ' + isChecked + '>' + chart_columns_arr[i].name + '</label>';
		
		chart_columns.insertAdjacentHTML("beforeend",txt);
	}
	
	// Default external links for holdings/watchlists
	let external_links_arr;
	let external_links = document.getElementById("config_external_links");
	if (localStorage.getItem("external_links") !== null) {
		external_links_arr = localStoreObjectGet("external_links");	
	} else {
		external_links_arr = [{"name":"Ally","display":true},{"name":"Robinhood","display":true},{"name":"Fidelity","display":true},{"name":"TradingView","display":true},{"name":"Yahoo","display":true}];
		localStoreObjectSet("external_links", external_links_arr);
	}
	for (var i = 0; i < external_links_arr.length; i++) {
		let isChecked = "";
		if (external_links_arr[i].display) {isChecked = " checked";}
		let txt = '<label id="lbl_l_chc' + i + '" for="l_chc' + i + '1" draggable="true" ondragstart="drag(event)" ondrop="dropOpt(event)" ondragover="allowDrop(event)">' +
		'<input type="checkbox" id="l_chc' + i + '" onchange="setExternalLinks();" value="' + external_links_arr[i].name + '" ' + isChecked + '>' + external_links_arr[i].name + '</label>';
		
		external_links.insertAdjacentHTML("beforeend",txt);
	}
	
	// Default selected accounts
	let selected_accounts_arr;
	if (localStorage.getItem("selected_accounts") !== null) {
		selected_accounts_arr = localStoreObjectGet("selected_accounts");	
	} else {
		selected_accounts_arr = [];
		localStoreObjectSet("selected_accounts", selected_accounts_arr);
	}
	
	// Begin remainder of loading process
	getProfileData();
}

function btnHoldingModal(symbol) {
	//Setup Form
	let form = document.getElementById("id01_form");
	let hrow = document.getElementById("trid_" + symbol);
	let desc = hrow.cells.item(0).getElementsByClassName("desc")[0].innerText;
	// comments	
	document.getElementById("id01_comments").value = getHoldingComment(symbol);
	document.getElementById('id01_comments').classList.remove("dirty");
	document.getElementById('id01_comments').addEventListener("change", changeComment);
	document.getElementById('id01').style.display='block';
	// populate alerts table
	document.getElementById("id01_title").innerText = "Summary - " + symbol + " - " + desc;
	document.getElementById("id01_holding").value = symbol;
	document.getElementById("id01_alert_trigger").value = "lastprice";
	document.getElementById("id01_alert_condition").value = "greater";
	document.getElementById("id01_alert_target").value = "";
	document.getElementById("id01_alert_notes").value = "";
	document.getElementById("id01_alerts-table").getElementsByTagName("tbody")[0].innerHTML = "";

	let alerts = localStoreObjectGet("alerts");
	for (let alrt of alerts) {
		if (alrt.symbol == symbol) {
			alertModalTableAdd(alrt);
		}
	}
	
	// populate anaysis table
	let tbl = document.getElementById("analysis-table").tBodies[0];
	let adp_200 = parseFloat(hrow.getAttribute("adp_200"));
	let adp_100 = parseFloat(hrow.getAttribute("adp_100"));
	let adp_50 = parseFloat(hrow.getAttribute("adp_50")); 
	let vwap = parseFloat(hrow.getAttribute("vwap"));
	let lastprice = parseFloat(hrow.getAttribute("lastprice"));
	tbl.rows[0].cells[4].innerHTML = "";
	
	if (lastprice >= adp_200) {
		tbl.rows[0].cells[0].innerHTML = adp_200.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-up"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="up">UP </span>');
	} else {
		tbl.rows[0].cells[0].innerHTML = adp_200.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-down"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="down">DOWN </span>');
	}
	if (lastprice >= adp_100) {
		tbl.rows[0].cells[1].innerHTML = adp_100.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-up"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="up">UP </span>');
	} else {
		tbl.rows[0].cells[1].innerHTML = adp_100.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-down"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="down">DOWN </span>');
	}
	if (lastprice >= adp_50) {
		tbl.rows[0].cells[2].innerHTML = adp_50.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-up"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="up">UP </span>');
	} else {
		tbl.rows[0].cells[2].innerHTML = adp_50.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-down"></i>';
		tbl.rows[0].cells[4].insertAdjacentHTML('beforeend','<span class="down">DOWN </span>');
	}
	if (lastprice >= vwap) {
		tbl.rows[0].cells[3].innerHTML = vwap.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-up"></i>';
	} else {
		tbl.rows[0].cells[3].innerHTML = vwap.toLocaleString('en-US',{style: 'currency', currency: 'USD',}) + '<i class="fas fa-caret-down"></i>';
	}
	
	// External Advanced Chart
	let charttext = '<!-- TradingView Widget BEGIN --> ' + 
	'<!-- https://www.tradingview.com/widget/advanced-chart/ -->' +
	'<div class="tradingview-widget-container">' + 
	'  <div id="' + 'tradingviewmodal_' + symbol + '"></div>' + 
	'</div>' + 
	'<!-- TradingView Widget END -->';			
	document.getElementById("id01_chart").innerHTML = charttext;
	// initiate chart
	new TradingView.widget({
		"autosize": true,
		"width":"100%",
		"height":"100%",
		"symbol": symbol, 
		"timezone": "America/New_York", 
		"theme": "dark", 
		"style": "1", 
		"locale": "en", 
		"toolbar_bg": "#f1f3f6", 
		"enable_publishing": false,
		"withdateranges": true,
		"range": "3M",
		"hide_side_toolbar": false,
		"hide_top_toolbar": false, 
		"hide_legend": false, 
		"save_image": false, 
		"details": true,
		"studies": [
		  "MASimple@tv-basicstudies"
		],
		"container_id": "tradingviewmodal_" + symbol 
	}); 
}

function changeComment() {
	document.getElementById('id01_comments').classList.add("dirty");
}

function btnCloseHoldingModal() {

	if (document.getElementById("id01_comments").classList.contains("dirty")) {
		let symbol = document.getElementById('id01_holding').value;
		let comment = document.getElementById("id01_comments").value;
		setHoldingComment(symbol,comment);
	}
	
	document.getElementById('id01').style.display='none';
}

function tblSort(tblID, n, type) {
  // tblID is the table element id, n is column number, type can be text/number
  loaderOn();
  document.getElementById('processing').style.display = 'block';
  
  var table, rows, switching, i, x, xVal, y, yVal, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(tblID);
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
	  
	  if (type == "text") {
		  xVal = x.innerText.toLowerCase();
		  yVal = y.innerText.toLowerCase();		  
	  } else if (type == "number") {
		  xVal = parseFloat(x.innerText);
		  yVal = parseFloat(y.innerText);
	  } else if (type == "dollar") { 
	      xVal = dollarToFloat(x.innerText);
		  yVal = dollarToFloat(y.innerText);
	  } else if (type == "percent") {
		  xVal = percentToFloat(x.innerText);
		  yVal = percentToFloat(y.innerText);
	  } else {
	      break;
	  }
	 
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (xVal > yVal) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (xVal < yVal) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  loaderOff();
}	

function apiAccountData(url) {
	var req = new XMLHttpRequest();
	//var path = "https://devapi.invest.ally.com/v1/accounts.json";
	var path = url 
	req.open("GET", path, true);
	req.setRequestHeader("Accept","application/json");
	req.setRequestHeader("Content-Type","application/json");
	//req.setRequestHeader("Authorization",auth);
	
	req.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var res = JSON.parse(this.response);
				//console.log(res);
				if (res) {
					return res;
				} else {
					spinner("halt");
				}
			}
		}
	};
	
	req.onerror = function() {
		spinner("halt");
	};
		
	req.send();
}

function getProfileData() {
	// get member profile data from Ally Invest API
	// refactored to have local server get data, see 'api/get_member_profile.php'
	spinner("on");

	fetch('api/get_member_profile.php').then(function(response) {
		return response.json();
	}).then(function(response) {
		if (response.message == "Unable to get account data.") {
			//console.log(response);
			spinner("off");
		} else {
			// SETUP_EXTRA_ACCOUNTS
			// add each non Ally Invest accounts used in "/data/extra_accounts.csv" to the account array
			response.account.push({"account": "ALLY-ESPP", "nickname": "Solium"});
			response.account.push({"account": "ALLY-401K", "nickname": "Alight"});
			response.account.push({"account": "Betterment-1234", "nickname": "Betterment"});
			
			// populate selected accounts dropdown 
			var elm = document.getElementById("checkboxes");
			var txt = "";
			var i = 1;
			var selected_accounts_arr = localStoreObjectGet("selected_accounts");
			response.account.forEach(account => {
				let isChecked = "";
				if (selected_accounts_arr.includes(account.account)) {isChecked = " checked";}
				
				// add to account summary
				txt += '<label for="chk' + i + '">';
				txt += '<input type="checkbox" id="chk' + i + '" name="accountNumber" value="' + account.account + '" onchange="accountsSelected()"' + isChecked + '/>';
				txt += account.nickname + '-' + account.account.substr(account.account.length - 4);
				txt += '</label>';
				i ++;
			});
			elm.innerHTML = txt;
			
			spinner("off");
			getAlerts();
			getWatchLists();
			refreshAccountInterval();			
		}
	}).catch(function(err) {
		console.log('getProfileData - Fetch problem: ' + err.message);
		spinner("halt");
	});
		
}


function toggleGetAccount() {
	let e = document.getElementById("account-sync");
	e.classList.remove("fa-spin");
	if (e.classList.contains("down")) {
		// refreshing currently halted, resume
		e.classList.remove("down");
		refreshAccountInterval();
	} else {
		spinner("halt");
		clearInterval(getDataInterval);
	}
}

function spinner(event) {
	let e = document.getElementById("account-sync");
	if (event == "on") {
		//e.classList.remove("down");
		e.classList.add("fa-spin");
	} else if (event == "off") {
		//e.classList.remove("down");
		e.classList.remove("fa-spin");
	} else if (event == "halt") {
		e.classList.remove("fa-spin");
		e.classList.add("down");
	}
}

function getAccountData() {
	// get Account data from Ally Invest API
	// refactored to have local server get data
	// see 'api/get_accounts.php' for Ally Invest accounts.
	// see 'api/get_extra_accounts.php' for extra account holding data
	
	if (accountsChanged) {
		clearAccountsSelected();
	}
	
	spinner("on");
	
	// chain account and extra account requests
	fetch('api/get_accounts.php').then(function(response) {
		//return response.text();
		return response.json();
	}).then(function(response) {
		// get extra accounts
		var accounts = response;
		fetch('api/get_extra_accounts.php').then(function(response) {
			return response.json();
		}).then(function(response) {
			// combine recordsets
			if (response) {
				//console.log(accounts);
				if (Array.isArray(response)) {
					for (i = 0; i < response.length; i++) {
						accounts.push(response[i]);
					}
				
				} else {
					accounts.push(response);	
				}
				accountAggregator(accounts);
			} else {
				spinner("halt");
			}
			
		}).catch(function(err) {
			console.log('getAccountData - get_accounts - Fetch problem: ' + err.message);
			spinner("halt");
		});
	}).catch(function(err) {
		console.log('getAccountData - get_extra_accounts - Fetch problem: ' + err.message);
		spinner("halt");
	});
}

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const A = a.symbol.toUpperCase();
  const B = b.symbol.toUpperCase();

  let comparison = 0;
  if (A > B) {
    comparison = 1;
  } else if (A < B) {
    comparison = -1;
  }
  return comparison;
}

function selectedAccounts(){
	// which accounts will be used to create aggregated summary
	return localStoreObjectGet("selected_accounts");
}

function generateTableHead(table, data) {
  // not used
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  // not used
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function roundFloat(num) {
	var n = Math.round(num * 100) / 100; 
	if (n == -0) {n = 0;}
	return n;
}

function dollarToFloat(num) {
	num = num.replace("$","");
	num = num.replace(",","");
	return parseFloat(num);
}

function percentToFloat(num) {
	return parseFloat(num.replace("%",""));
}

function stringToDate(_date,_format,_delimiter) {
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

function DateToString(_date) {
	var month = '' + (_date.getMonth() + 1);
    var day = '' + _date.getDate();
    var year = _date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getHeaderFields() {
	//let arr = ["holdings","badges","chart","qty","lastprice","change","percent","marketvalue","costbasis","avgcost","gainloss","gainpercent","% of account","external links"];
	//return arr;
	return localStoreObjectGet("chart_columns");
}

function getHoldingData(symbol, field) {
	//return field value from the table row ID trid
	let row = document.getElementById("trid_" + symbol);
	if (!row) {return null;}
				
	switch (field) {
		case "desc":
			return row.getElementsByClassName("desc")[0].innerText;
			break;
		case "% of account":
			//let iCol = getHeaderFields.indexOf("% of account");
			let iCol = indexOfArray(getHeaderFields, "name", "% of account");
			return row.cells[iCol].innerText;
			break;
		default:
			return row.getAttribute(field);
			break;
	}
}

function getExternalLinksHTML(symbol) {
	// SETUP_EXTERNAL_LINKS
	let links = localStoreObjectGet("external_links");
	let iCol;
	let txt = '';
	
	links.forEach(item => {
		if (item.display) {
			switch (item.name) {
				case "Ally":
					txt += '<a target="_blank" href="https://live.invest.ally.com/research/stocks/' + symbol + '/overview"><img src="http://ally.com/favicon.ico" class="icon"></a>'
					break;
				case "Robinhood":
					txt += '<a target="_blank" href="https://robinhood.com/stocks/' + symbol + '"><img src="https://staging-cdn.robinhood.com/assets/generated_assets/167EWkdKrN2X6Jqp7LEO9o.ico" class="icon"></a>'	
					break;
				case "Fidelity":
					txt += '<a target="_blank" href="https://eresearch.fidelity.com/eresearch/evaluate/snapshot.jhtml?symbols=' + symbol + '"><img src="https://www.fidelity.com/favicon.ico" class="icon"></a>'
					break;
				case "TradingView":
					txt += '<a target="_blank" href="https://www.tradingview.com/symbols/' + symbol + '"><img src="https://www.tradingview.com/static/images/favicon.ico" class="icon"></a>'	
					break;
				case "Yahoo":
					txt += '<a target="_blank" href="https://finance.yahoo.com/quote/' + symbol + '"><img src="https://s.yimg.com/cv/apiv2/default/fp/20180826/icons/favicon_y19_32x32.ico" class="icon"></a>'	
					break;
				case "MSN Money":
					txt += '<a target="_blank" href="https://www.msn.com/en-us/money/stockdetails/fi-a1nbbh?symbol=' + symbol + '&form=PRSDRQ' + symbol + '"><img src="https://www.msn.com/favicon.ico" class="icon"></a>'	
					break;
				case "Google Finance":
					txt += '<a target="_blank" href="https://www.google.com/finance/quote/' + symbol + ':NYSE"><img src="https://ssl.gstatic.com/finance/favicon/favicon.png" class="icon"></a>'						
					break;
				default:
					break;
			}			
		}

	});

	return txt;
}

function accountAggregator(accountObj) {
	console.log( "Aggregation Time! " + new Date() );
	//console.log(accountObj);
	var accounts = selectedAccounts();
	var totalAccountValue = 0;
	var totalcashBuyingPower = 0;
	var totaltodaysGL = 0;
	var totaltodaysPCT = 0;
	var totalGL = 0;
	var totalcostbasis = 0;
	var totalcostbasis = 0;
	var holdings = [];
		
	accountObj.forEach(account => {
		// add to account summary
		if (accounts.length == 0 || accounts.includes(account.account) ) {
			totalAccountValue += parseFloat(account.accountbalance.accountvalue);
			totalcashBuyingPower += parseFloat(account.accountbalance.money.cashavailable);
		
			if(account.accountholdings && account.accountholdings.holding.length) {
				account.accountholdings.holding.forEach(holding => {
					// add to holdings
					totaltodaysGL += parseFloat(holding.marketvaluechange);
					totalGL += parseFloat(holding.gainloss);
					totalcostbasis += parseFloat(holding.costbasis);
				
					var item = {};
					item.symbol = holding.displaydata.symbol;
					if (item.symbol.includes("'")) {
						item.symbol = item.symbol.replace("'","");
					}
					item.cusip = holding.instrument.cusip;
					item.description = holding.displaydata.desc;
					item.qty = parseFloat(holding.displaydata.qty);
					item.lastprice = parseFloat(holding.price);
					item.change = parseFloat(holding.marketvaluechange / holding.displaydata.qty);			
					item.percent = parseFloat( ((item.lastprice/(item.lastprice - item.change)) - 1) * 100 );
					if (Number.isNaN(item.percent)) {item.percent = 0;}
					item.marketvalue = parseFloat(holding.marketvalue);
					item.costbasis = parseFloat(holding.costbasis);
					item.gainloss = parseFloat(holding.gainloss);
					item.gainpercent = parseFloat( (item.gainloss / item.costbasis) * 100 );
					if (Number.isNaN(item.gainpercent)) {item.gainpercent = 0;}
					
					var index = 0;
					var isFound = false;
					for (i = 0; i < holdings.length; i++) {
						if (item.symbol == holdings[i].symbol) {
							index = i;
							isFound = true;
						}
					}
				
					if (isFound) {
						holdings[index].qty += item.qty;
						holdings[index].gainloss += item.gainloss;
						holdings[index].marketvalue += item.marketvalue;
				    	holdings[index].costbasis += item.costbasis;
						holdings[index].gainpercent = parseFloat( (holdings[index].gainloss / holdings[index].costbasis) * 100 );
						if (Number.isNaN(holdings[index].gainpercent)) {holdings[index].gainpercent = 0;}
					} else {
						holdings.push(item);
					}
				});
				totaltodaysPCT = (( (totalAccountValue - totalcashBuyingPower) / ((totalAccountValue - totalcashBuyingPower) - totaltodaysGL)) - 1) * 100 ;
				if (Number.isNaN(totaltodaysPCT)) {totaltodaysPCT = 0;}
			}
		}
	});
	
	holdings.sort(compare);
	//console.log(holdings);
	
	// Populate Account Totals Summary Data
	totaltodaysGL = roundFloat(totaltodaysGL);
	totaltodaysPCT = roundFloat(totaltodaysPCT);
	totalGL = roundFloat(totalGL);
	document.getElementById("amtTotalValue").innerText = totalAccountValue.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtCashBuyingPower").innerText = totalcashBuyingPower.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	// Todays G/L
	document.getElementById("amtTodaysGL").innerText = totaltodaysGL.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtTodaysGL").className = "dollar-amount";
	document.getElementById("iTodaysGL").className = "";
	if (totaltodaysGL > 0) {
		document.getElementById("amtTodaysGL").classList.add("up");
		document.getElementById("iTodaysGL").classList.add("fas","fa-caret-up");
	} else if (totaltodaysGL < 0) {
		document.getElementById("amtTodaysGL").classList.add("down");
		document.getElementById("iTodaysGL").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTodaysGL").classList.add("fas");
	}
	
	// Todays PCT
	document.getElementById("amtTodaysPCT").innerText = totaltodaysPCT.toFixed(2) + "%";
	document.getElementById("amtTodaysPCT").className = "percent-amount";
	document.getElementById("iTodaysPCT").className = "";
	if (totaltodaysPCT > 0) {
		document.getElementById("amtTodaysPCT").classList.add("up");
		document.getElementById("iTodaysPCT").classList.add("fas","fa-caret-up");
	} else if (totaltodaysPCT < 0) {
		document.getElementById("amtTodaysPCT").classList.add("down");
		document.getElementById("iTodaysPCT").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTodaysPCT").classList.add("fas");
	}
	// Total G/L
	document.getElementById("amtTotalGL").innerText = totalGL.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtTotalGL").className = "dollar-amount";
	document.getElementById("iTotalGL").className = "";
	if (totalGL > 0) {
		document.getElementById("amtTotalGL").classList.add("up");
		document.getElementById("iTotalGL").classList.add("fas","fa-caret-up");
	} else if (totalGL < 0) {
		document.getElementById("amtTotalGL").classList.add("down");
		document.getElementById("iTotalGL").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTotalGL").classList.add("fas");
	}
	// Return on Investment
	var roi = roundFloat((totalGL / totalcostbasis * 100));
	document.getElementById("amtROI").innerText = roi.toFixed(2) + "%";
	document.getElementById("amtROI").className = "percent-amount";
	document.getElementById("iROI").className = "";
	if (roi > 0) {
		document.getElementById("amtROI").classList.add("up");
		document.getElementById("iROI").classList.add("fas","fa-caret-up");
	} else if (roi < 0) {
		document.getElementById("amtROI").classList.add("down");
		document.getElementById("iROI").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iROI").classList.add("fas");
	}
	
	// Create and populate holdings table data
	let table = document.getElementById("holdings-table");
	let tableHeader = getHeaderFields();
	table.innerHTML = "";

	// table data not available - create rows
	let header = table.createTHead();
	let hrow = header.insertRow();
	header.insertAdjacentHTML('beforeend','<i class="fas fa-chevron-circle-down tbodyicon icon-left" onclick="toggleTBody(this, \'holdings-table\');"></i>');
	let iCol = 0;
	
	for (let item of tableHeader) {
		let key = item.name
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		let txtType = "";
		let add = false;
		switch(key) {
			case "holdings":
				// modified column
				th.innerHTML = '<th>holdings <span id="holdingcount" class="badge"></span></th>';
				th.setAttribute("onclick","loaderOn(tblSort,'holdings-table'," + iCol + ",'" + "text" + "');");
				th.classList.add("min-width-10");
				if (!item.display) {th.classList.add("ninja");}
				hrow.appendChild(th);
				iCol++;	
				break;
			case "badges":
				// extra column
				th.setAttribute("onclick","toggleExternalBadges();");
				th.classList.add("ext-badges");
				if (!item.display) {th.classList.add("ninja");}
				hrow.appendChild(th);
				iCol++;	
				break; 
			case "chart":
				th.appendChild(text);
				th.setAttribute("onclick","toggleExternalChart();");
				if (!item.display) {th.classList.add("ninja");}
				hrow.appendChild(th);
				iCol++;	
				break;
			case "external links":
				// extra column
				th.appendChild(text);
				th.setAttribute("onclick","toggleExternalLinks();");
				if (!item.display) {th.classList.add("ninja");}
				hrow.appendChild(th);
				iCol++;
				break;
			case "qty":
			case "lastprice":
				add = true;
				txtType = "number";
				break;
			case "percent":
			case "gainpercent":
			case "% of account":
				add = true;
				txtType = "percent";
				break;
			case "change":
			case "marketvalue":
			case "costbasis":
			case "gainloss":
			case "avgcost":
				add = true;
				txtType = "dollar";
				break;
			default:
				// code block
		}
		
		if (add) {
			th.appendChild(text);
			th.setAttribute("onclick","loaderOn(tblSort,'holdings-table'," + iCol + ",'" + txtType + "');");
			if (!item.display) {th.classList.add("ninja");}
			hrow.appendChild(th);
			iCol++;	
		}
	}

	// create table rows
	let tbody = document.createElement("tbody");
	table.appendChild(tbody);
	tbody = table.getElementsByTagName("tbody")[0];
	
	for (let holding of holdings) {
		let row = tbody.insertRow();
		row.id = "trid_" + holding.symbol;
		row.setAttribute("cusip", holding.cusip);		
		row.setAttribute("qty", holding.qty);
		row.setAttribute("lastprice", holding.lastprice);
		row.setAttribute("change", holding.change);
		row.setAttribute("percent", holding.percent);
		row.setAttribute("marketvalue", holding.marketvalue);
		row.setAttribute("costbasis", holding.costbasis);
		row.setAttribute("gainloss", holding.gainloss);
		row.setAttribute("gainpercent", holding.gainpercent);
		row.setAttribute("acctpercent", "0.0");
		
		for (let item of tableHeader) {
			let key = item.name;
			let cell = row.insertCell();
			let cellval = holding[key];
			if (!item.display) {cell.classList.add("ninja");}
			
			// cell classes
			switch(key) {
				case "holdings":
					cell.className = "holding";
					break;
				case "badges":
					cell.classList.add("ext-badges");
					break;
				case "chart":
					cell.classList.add("ext-chart");
					break;
				case "change":
				case "percent":
				case "gainloss":
				case "gainpercent":
					if (roundFloat(parseFloat(cellval)) > 0) {cell.classList.add("up");}
					if (roundFloat(parseFloat(cellval)) < 0) {cell.classList.add("down");}
					break;
				case "external links":
					cell.classList.add("ext-links");
					break;

				default:
					// do nothing			
			}
				
			// cell contents
			let text;
			switch(key) {
				case "holdings":
					cellval = holding["symbol"] + " - " + holding["description"];
					text = document.createElement("div");
					text.className = "symb";
					text.innerText = holding["symbol"];
					cell.appendChild(text);
					
					text = document.createElement("div");
					text.className = "desc";
					text.innerText = " " + holding["description"];						
					cell.appendChild(text);
					break;
				case "badges":
					cell.innerHTML = '' + 
					'<span id="badge-D-' + holding["symbol"] + '" class="holding-icon tooltip ninja">' + 
					'<i class="fas fa-hand-holding-usd" style="display:inline"></i>' + 
					'<div id="tooltip-D-' + holding["symbol"] + '" class="tooltiptext"></div>' +
					'</span>' +
					'<span id="badge-C-' + holding["symbol"] + '" class="holding-icon tooltip ninja">' + 
					'<i class="far fa-comment-dots"  style="display:inline"></i>' +				
					'<div id="tooltip-C-' + holding["symbol"] + '" class="tooltiptext"></div>' +
					'</span>' + 
					'<span id="badge-I-' + holding["symbol"] + '" class="holding-icon" onclick="btnHoldingModal(\'' + holding["symbol"] + '\');">' + 
					'<i class="fas fa-file-invoice"  style="display:inline"></i>' +				
					'</span>';

					break;
				case "chart":
					if (item.display) {
						// External Medium Chart
						let charttext = '<!-- TradingView Widget BEGIN --> ' + 
						'<!-- https://www.tradingview.com/widget/symbol-overview/ -->' +
						'<div class="ext-chart-graph">' + 
						'<div class="tradingview-widget-container">' + 
						'  <div id="' + 'tradingview_' + holding.symbol + '"></div>' + 
						'</div>' + 
						'</div>' +
						'<!-- TradingView Widget END -->';			
						cell.innerHTML = charttext;
						// initiate chart
						new TradingView.MediumWidget(
						  {
						  "symbols": [
							[
							  holding.symbol + "|" + localStorage.getItem("chart_interval")
							]
						  ],
						  "chartOnly": true,
						  "autosize": true,
						  "width": "100%",
						  "height": "100%",
						  "locale": "en",
						  "colorTheme": "dark",
						  "gridLineColor": "#2a2e39",
						  "trendLineColor": "#1976d2",
						  "fontColor": "#787b86",
						  "underLineColor": "rgba(0, 0, 0, 0)",
						  "isTransparent": false,
						  "container_id": "tradingview_" + holding.symbol
						  }
						);
					}
					break;
				case "qty":
					if (Number.isInteger(cellval)) {
						text = document.createTextNode(cellval);
					} else {
						let num = cellval.toFixed(3);
						text = document.createTextNode(num);
					}
					cell.appendChild(text);
					break;
				case "lastprice":
					text = document.createTextNode(cellval);
					cell.appendChild(text);
					break;
				case "change":
				case "marketvalue": 
				case "costbasis":
				case "gainloss":
					cellval = roundFloat(holding[key]).toLocaleString('en-US',{style: 'currency', currency: 'USD',});
					text = document.createTextNode(cellval);
					cell.appendChild(text);
					break;
				case "percent":
				case "gainpercent":
					cellval = roundFloat(cellval).toFixed(2) + "%";
					text = document.createTextNode(cellval);
					cell.appendChild(text);
					break;
				case "avgcost":				
					let avgcost = (holding["costbasis"] / holding["qty"]);
					if (Number.isNaN(avgcost)) {
						cellval = "N/A";
					} else {
						cellval = roundFloat(avgcost).toLocaleString('en-US',{style: 'currency', currency: 'USD',});	
					}
					text = document.createTextNode(cellval);
					cell.appendChild(text);	
					break;
				case "% of account":
					let percentofaccount = (holding["marketvalue"] / totalAccountValue) * 100;
					if (Number.isNaN(percentofaccount)) {percentofaccount = 0;}
					let pertext = percentofaccount.toFixed(2) + "%";
					text = document.createTextNode(pertext);
					cell.appendChild(text);	
					break;
				case "external links":
					let txt = getExternalLinksHTML(holding.symbol);
					cell.insertAdjacentHTML('beforeend', txt);	
					break;
				default:
					//do nothing
			}
		}
	}
	
	// iFrame update for Chart
	var elms = document.getElementsByTagName("iframe");
	for (i=0; i < elms.length; i++) {
		elms[i].style.width = "max-content";
		elms[i].style.height = "80px";
	}
	
	//Account-sync spinner
	updateHoldingCount();
	//updateHoldingComments();
	getHoldingComments();
	//alerts
	alertReview();
	alertUpdateQueue();
	spinner("off");
}

function updateHoldingCount() {
	document.getElementById("holdingcount").innerText = getHoldingSymbols("symb").length;
}

function getHoldingSymbols(className) {
	// get array of symbols
	var elms = document.getElementsByClassName(className);
	var holdings = [];
	for (i = 0; i < elms.length; i++) {
		holdings.push(elms[i].innerText);
	}
	return holdings;
}

function updateHoldingComments() {
	var holdings = getHoldingSymbols("symb");
	for (i = 0; i < holdings.length; i++) {
		let elmB = document.getElementById("badge-C-" + holdings[i]);
		let elmC = document.getElementById("tooltip-C-" + holdings[i]);
		if (localStorage.getItem(holdings[i]) !== null) {
			elmB.classList.remove("ninja");
			elmC.innerText = localStorage.getItem(holdings[i]);
		} else {
			elmB.classList.add("ninja");
			elmC.innerText = "";
		}
	}
}

function getHoldingComments() {
	// get comment information
	fetch('api/comments.php').then(function(response) {
		//return response.text();
		return response.json();
	}).then(function(response) {
		if (response) {
			for (i = 0; i < response.length; i++) {
				let elmB = document.getElementById("badge-C-" + response[i].symbol);
				let elmC = document.getElementById("tooltip-C-" + response[i].symbol);
				if (elmB != null) 
					elmB.classList.remove("ninja");
				if (elmC != null)
					elmC.innerText = response[i].comment;
			}
		}
	}).catch(function(err) {
		console.log('getHoldingComments - Fetch problem: ' + err.message);
	});
}

function getHoldingComment(symbol) {
	let elm = document.getElementById("tooltip-C-" + symbol);
	return elm.innerHTML; 
}

function setHoldingComment(symbol, comment) {
	if (symbol) {
		//if (comment.length > 0) {
			//localStorage.setItem(symbol,comment);
		//} else {
			//localStorage.removeItem(symbol);
		//}		
		//updateHoldingComments()
		let req = {};
		req.symbol = symbol;
		req.comment = comment.trim();
		let elmB = document.getElementById("badge-C-" + symbol);
		let elmC = document.getElementById("tooltip-C-" + symbol);
		elmB.classList.remove("ninja");
		elmC.innerHTML = req.comment;
		
		fetch("api/comments.php", {
			method: "POST",
			body: JSON.stringify(req),
			headers: {"Content-Type":"application/json"}
		})
		.then(function(response) {
			return response.json();
		}) 
		.then(function(response) {
			if (response) {
				if (response.message != "success") {
					console.log(response);
				}
			}
		})
		.catch(function(err) {
			console.log('setHoldingComment - Fetch problem: ' + err.message);
		});
		
	}
}

function getAlerts() {
	// get alert information 
	// id, symbol, trigger, condition, target, notes
	localStorage.removeItem("alerts");
	
	fetch('api/alerts.php').then(function(response) {
		return response.json();
	}).then(function(response) {
		if (response) {
			localStoreObjectSet("alerts", response);
			let alertsQueue = [];
			localStoreObjectSet("alerts_queue", alertsQueue);
			setupAlertsTable();
		}
	}).catch(function(err) {
		console.log('getAlerts - Fetch problem: ' + err.message);
	});
}

function setAlerts(type, holdingAlert) {
	// add/update/delete alerts to server file
	let req = {};
	req.type = type;
	if (type == "delete") {
		req.id = holdingAlert;
	} else {
		req.id = holdingAlert.id;
		req.symbol = holdingAlert.symbol;
		req.trigger = holdingAlert.trigger;
		req.condition = holdingAlert.condition;
		req.target = holdingAlert.target;
		req.notes = holdingAlert.notes;
	}
	
	// async request
	fetch("api/alerts.php", {
		method: "POST",
		body: JSON.stringify(req),
		headers: {"Content-Type":"application/json"}
	})
	.then(function(response) {
		return response.json();
	}) 
	.then(function(response) {
		if (response) {
			if (response.message != "success") {
				console.log(response);
			}
		}
	})
	.catch(function(err) {
		console.log('setAlerts - Fetch problem: ' + err.message);
	});

}

function alertDisplay(symbol, holdingAlert) {
	let elm = document.getElementById("alerts");
	let ext = holdingAlert.symbol == "*" ? "_" + symbol : "";
	let txt;
	if (holdingAlert.trigger == "trailloss") {
		txt = '<div id="alert_id_' + holdingAlert.id + ext + '" alert_id="' + holdingAlert.id + '" class="alert less">' +
		'<span class="closebtn" onclick="alertClear(this);"><i class="fas fa-eye-slash"></i></span>' +
		'<span class="closebtn" onclick="alertRemove(this);"><i class="fas fa-trash"></i></span>' +
		'<strong>' + symbol + ': </strong> ' +  
		'Trailing Stop Loss reached at $' + holdingAlert.condition + ' less than $' + holdingAlert.target + 
		'.<br>' + holdingAlert.notes + '</div>';
	} else if (holdingAlert.trigger == "trailpercent") {
		txt = '<div id="alert_id_' + holdingAlert.id + ext + '" alert_id="' + holdingAlert.id + '" class="alert less">' +
		'<span class="closebtn" onclick="alertClear(this);"><i class="fas fa-eye-slash"></i></span>' +
		'<span class="closebtn" onclick="alertRemove(this);"><i class="fas fa-trash"></i></span>' +
		'<strong>' + symbol + ': </strong> ' +  
		'Trailing Stop Percent reached at ' + holdingAlert.condition + '% less than $' + holdingAlert.target + 
		'.<br>' + holdingAlert.notes + '</div>';
	} else {
		txt = '<div id="alert_id_' + holdingAlert.id + ext + '" alert_id="' + holdingAlert.id + '" class="alert ' + holdingAlert.condition + '">' +
		'<span class="closebtn" onclick="alertClear(this);"><i class="fas fa-eye-slash"></i></span>' +
		'<span class="closebtn" onclick="alertRemove(this);"><i class="fas fa-trash"></i></span>' +
		'<strong>' + symbol + ': </strong> ' +  
		holdingAlert.trigger + ' is ' + holdingAlert.condition + ' than ' + holdingAlert.target + 
		'.<br>' + holdingAlert.notes + '</div>';
	}
	
	elm.insertAdjacentHTML("beforeend",txt);
}

function btnCreateAlert() {
	let holdingAlert = {};
	holdingAlert.id = guid();
	holdingAlert.symbol = document.getElementById("alert_symbol").value;
	holdingAlert.trigger = document.getElementById("alert_trigger").value;
	holdingAlert.condition = document.getElementById("alert_condition").value;
	holdingAlert.target = document.getElementById("alert_target").value;
	holdingAlert.notes = document.getElementById("alert_notes").value.trim();
	
	if (holdingAlert.target != "") {
		alertTableAdd(holdingAlert);
		alertAdd(holdingAlert);
	}
}


function btnCreateModalAlert() {
	let form = document.getElementById("id01_form")
	let holdingAlert = {};
	holdingAlert.id = guid();
	holdingAlert.symbol = form.id01_holding.value;
	holdingAlert.trigger = form.alert_trigger.value;
	holdingAlert.condition = form.alert_condition.value;
	holdingAlert.target = form.alert_target.value;
	holdingAlert.notes = form.alert_notes.value.trim();
	
	if (holdingAlert.target != "") {
		alertModalTableAdd(holdingAlert);
		alertTableAdd(holdingAlert);
		alertAdd(holdingAlert);
	}
}

function alertClear(elm) {
	let div = elm.parentElement;
	div.style.opacity = "0";
	setTimeout(function(){ 
		div.style.display = "none";
	}, 500);
}

function alertRemove(elm) {
	let div = elm.parentElement;
	let alertID = div.getAttribute("alert_id");
	div.style.opacity = "0";
	setTimeout(function(){ 
		div.style.display = "none";
		alertDelete(alertID);
	}, 500);
}

function alertTableAdd(holdingAlert) {
	let tbl = document.getElementById("alerts-table").getElementsByTagName("tbody")[0];
	let row = '<tr id="' + holdingAlert.id + '" alert_id="' + holdingAlert.id + '"><td>' + holdingAlert.symbol + '</td><td>' + holdingAlert.trigger + '</td>' +
	'<td>' + holdingAlert.condition + '</td>' + 
	'<td>' + holdingAlert.target + '</td>' + 
	'<td>' + holdingAlert.notes + '</td>' + 
	'<td><span class="closebtn" onclick="alertRemove(this.parentElement);"><i class="fas fa-trash"></i></span></td></tr>';
	
	tbl.insertAdjacentHTML("beforeend",row);
}

function alertModalTableAdd(holdingAlert) {
	let tbl = document.getElementById("id01_alerts-table").getElementsByTagName("tbody")[0];
	let row = '<tr id="' + "id01_" + holdingAlert.id + '" alert_id="' + holdingAlert.id + '"><td></td><td>' + holdingAlert.trigger + '</td>' +
	'<td>' + holdingAlert.condition + '</td>' + 
	'<td>' + holdingAlert.target + '</td>' + 
	'<td>' + holdingAlert.notes + '</td>' + 
	'<td><span class="closebtn" onclick="alertRemove(this.parentElement);"><i class="fas fa-trash"></i></span></td></tr>';
	
	tbl.insertAdjacentHTML("beforeend",row);
}

function setupAlertsTable() {
	let alerts = localStoreObjectGet("alerts");
	alerts.sort(compare);
	for (let alrt of alerts) {
		alertTableAdd(alrt);
	}
}

function alertAdd(holdingAlert) {
	let alerts = localStoreObjectGet("alerts");
	if (!Array.isArray(alerts)) {
		alerts = [];
	}
	alerts.push(holdingAlert);
	localStoreObjectSet("alerts", alerts);
	setAlerts("add",holdingAlert);
}

function alertUpdate(holdingAlert) {
	let alerts = localStoreObjectGet("alerts");
	let alertsQueue = localStoreObjectGet("alerts_queue");
	if (!Array.isArray(alerts)) {
		alerts = [];
	}
	if (!Array.isArray(alertsQueue)) {
		alertsQueue = [];
	}
	let tmpAlerts = [];
	for (i = 0; i < alerts.length; i++) {
		if (alerts[i].id == holdingAlert.id) {
			tmpAlerts.push(holdingAlert);
			alertsQueue.push(holdingAlert);
		} else {
			tmpAlerts.push(alerts[i]);
		}
	}
	alerts = tmpAlerts;	
	localStoreObjectSet("alerts", alerts);
	localStoreObjectSet("alerts_queue", alertsQueue);
	//setAlerts("update",holdingAlert);
}

function alertDelete(alertID) {
	let alerts = localStoreObjectGet("alerts");
	if (!Array.isArray(alerts)) {
		alerts = [];
	} else {
		let tmpAlerts = [];
		for (i = 0; i < alerts.length; i++) {
			if (alerts[i].id != alertID) {
				tmpAlerts.push(alerts[i]);
			}
		}
		alerts = tmpAlerts;
	}
	
	if(document.getElementById(alertID)) {
		document.getElementById(alertID).remove();
	}
	if(document.getElementById("id01_" + alertID)) {
		document.getElementById("id01_" + alertID).remove();
	}
	if(document.getElementById("alert_id_" + alertID)) {
		document.getElementById("alert_id_" + alertID).remove();
	}
	
	localStoreObjectSet("alerts", alerts);
	setAlerts("delete",alertID);
}

function alertUpdateQueue() {
	let alertsQueue = localStoreObjectGet("alerts_queue");
	if (!Array.isArray(alertsQueue)) {
		alertsQueue = [];
	}
	if (alertsQueue.length > 0) {
		let holdingAlert = alertsQueue.shift();
		console.log("UpdateAlerts remaining in queue:" + alertsQueue.length);
		setAlerts("update",holdingAlert);	
		localStoreObjectSet("alerts_queue", alertsQueue);
		setTimeout(alertUpdateQueue, 1000);
	}
}

function localStoreObjectGet(key) {
	return JSON.parse(localStorage.getItem(key));
}

function localStoreObjectSet(key, obj){
	localStorage.setItem(key, JSON.stringify(obj));
}

function reviewCompare(trgVal, currVal, condition) {
	switch (condition){
		case "greater":
			return currVal >= trgVal ? true : false;
			break;
		case "less":
			return currVal <= trgVal ? true : false;
			break;
		default:
			return false;
	}
}

function alertReview() {
	// id, symbol, trigger, condition, target, notes
	let reviewAlerts = localStoreObjectGet("alerts");
	if (reviewAlerts) {
		let currentValue;
		let targetValue;
		let condition;
		let foundSymbols = getHoldingSymbols("symb").concat(getHoldingSymbols("watch_symb")).unique();
		for (let alrt of reviewAlerts) {
			let symbols = [];
			if (alrt.symbol == "*") {
				// any holding
				symbols = foundSymbols;			
			} else {
				// specific holding
				symbols.push(alrt.symbol);
			}
				// continue existing alert notification
			
			for (let symbol of symbols) {
				if ( (alrt.symbol != "*" && document.getElementById("alert_id_" + alrt.id)) ||
					(alrt.symbol == "*" && document.getElementById("alert_id_" + alrt.id + "_" + symbol))
				){continue;}
				condition = alrt.condition;
				targetValue = parseFloat(alrt.target);
				let hrow = document.getElementById("trid_" + symbol);
				if (hrow) {
					switch (alrt.trigger) {
						// lastprice, percent, gainloss, gainpercent, date, trailloss, trailpercent
						case "lastprice":
							currentValue = parseFloat(hrow.getAttribute("lastprice"));
							if (currentValue == 0) {continue;}
							break;
						case "percent":
							currentValue = parseFloat(hrow.getAttribute("percent"));
							break;
						case "gainloss":
							currentValue = parseFloat(hrow.getAttribute("gainloss"));
							break;
						case "gainpercent":
							currentValue = parseFloat(hrow.getAttribute("gainpercent"));
							break;
						case "date":
							currentValue = new Date();
							targetValue = stringToDate(alrt.target,"yyyy-mm-dd","-");
							break;
						case "trailloss":
							condition = "less";
							currentValue = parseFloat(hrow.getAttribute("lastprice"));
							if (currentValue == 0) {continue;}
							if (currentValue > targetValue) {
								// raise alert ceiling
								targetValue = currentValue;
								alrt.target = targetValue;
								console.log("alertUpdate: " + alrt.symbol + ", New high: " + targetValue + ", id:" + alrt.id);
								alertUpdate(alrt);
							}
							targetValue = targetValue - parseFloat(alrt.condition);
							break;
						case "trailpercent":
							condition = "less";
							currentValue = parseFloat(hrow.getAttribute("lastprice"));
							if (currentValue == 0) {continue;}
							if (currentValue > targetValue) {
								// raise alert ceiling
								targetValue = currentValue;
								alrt.target = targetValue;
								console.log("alertUpdate: " + alrt.symbol + ", New high: " + targetValue);
								alertUpdate(alrt);
							}
							targetValue = targetValue - (parseFloat(alrt.condition) / 100 * targetValue);
							break;
					}
					// fire alert if triggered
					if ( reviewCompare(targetValue, currentValue, condition) ) {
						alertDisplay(symbol, alrt);
					}
				} 
			}
		}
	}
}

function getHoldingQuotes() {
	// get realtime quote data
	spinner("on");
	
	let holdings = getHoldingSymbols("symb");
	let watches = getHoldingSymbols("watch_symb");
	let symbols = holdings.concat(watches);
	var holdingString = symbols.join();
	var fields = "symbol,name,last,chg,chg_sign,pchg,pchg_sign,vwap,adp_50,adp_100,adp_200,div,divfreq,divexdate,divpaydt,iad,yield,wk52hi,wk52lo,date";
	fetch("api/get_market_quotes.php", {
		method: "POST",
		body: "symbols=" + holdingString + "&fids=" + fields,
		headers: {"Content-Type":"application/text"}
	})
	.then(function(response) {
		return response.json();
	}) 
	.then(function(response) {
		//
		var quotes = [];
		if  (response.hasOwnProperty('message')) {
			console.log("getHoldingQuotes - error: " + response.message);
			spinner("halt");
		} else {
			if (Array.isArray(response)) {
				quotes = response;
			} else {
				quotes.push(response);
			}
			updateHoldingsFromQuotes(quotes);
			updateWatchListsFromQuotes(quotes);
		}
	})
	.catch(function(err) {
		console.log('getHoldingQuotes - Fetch problem: ' + err.message);
		spinner("halt");
	});
}

function updateHoldingsFromQuotes(quotes) {
	// holding data from account or from quote
	// table data is already available - process updates
	let tableHeader = getHeaderFields();
	let iCol = 0;
	let quote;
	for (quote of quotes) {
		let hrow = document.getElementById("trid_" + quote.symbol)
		if (hrow) {
			// qty
			//iCol = tableHeader.indexOf("qty");
			iCol = indexOfArray(tableHeader, "name", "qty");
			if (quote.qty) {
				hrow.setAttribute("qty", quote.qty);
				hrow.cells[iCol].innerText = quote.qty;
			} else {
				quote.qty = parseFloat(hrow.cells[iCol].innerText);
			}
			if (!tableHeader[iCol].display) {th.classList.add("ninja");}
			// lastprice
			//iCol = tableHeader.indexOf("lastprice");
			iCol = indexOfArray(tableHeader, "name", "lastprice");
			if (quote.last) {
				quote.lastprice = parseFloat(quote.last);
			}
			if (quote.lastprice) {
				hrow.setAttribute("lastprice", quote.lastprice);
				hrow.cells[iCol].innerText = quote.lastprice.toFixed(2);
			} else {
				quote.lastprice = parseFloat(hrow.cells[iCol].innerText);
			}
			//Last trade date
			let todayDate = DateToString(new Date());
			let updatedToday = todayDate == quote.date ? true: false;
			
			// change
			//iCol = tableHeader.indexOf("change");
			iCol = indexOfArray(tableHeader, "name", "change");
			let change = 0;
			if (updatedToday) {
				if (quote.chg) {
					quote.change = parseFloat(quote.chg);
				} 
				if (quote.change) {
					change = roundFloat(quote.change);
					hrow.setAttribute("change", change);
					hrow.cells[iCol].innerText = change.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
				} else {
					change = roundFloat(dollarToFloat(hrow.cells[iCol].innerText));
				}				
			}
			if (change > 0) {
				hrow.cells[iCol].className = "up";
			} else if (change < 0) {
				hrow.cells[iCol].className = "down";
			} else {
				hrow.cells[iCol].className = "";
			}
			if (!tableHeader[iCol].display) {hrow.cells[iCol].classList.add("ninja");}
			// percent
			//iCol = tableHeader.indexOf("percent");
			iCol = indexOfArray(tableHeader, "name", "percent");
			let percent = 0;
			if (updatedToday) {
				if (quote.pchg) {
					quote.percent = parseFloat(quote.pchg);
				}
				if (quote.percent) {
					percent = roundFloat(quote.percent);
					hrow.setAttribute("percent", percent);
					hrow.cells[iCol].innerText = percent.toFixed(2) + "%"; 
				} else {
					percent = percentToFloat(hrow.cells[iCol].innerText);
				}
			}
			if (percent > 0) {
				hrow.cells[iCol].className = "up";
			} else if (percent < 0) {
				hrow.cells[iCol].className = "down";
			} else {
				hrow.cells[iCol].className = "";
			}
			
			if (!tableHeader[iCol].display) {hrow.cells[iCol].classList.add("ninja");}			
			// marketvalue
			//iCol = tableHeader.indexOf("marketvalue");
			iCol = indexOfArray(tableHeader, "name", "marketvalue");
			let marketvalue = quote.qty * quote.lastprice;	
			hrow.setAttribute("marketvalue", marketvalue);
			hrow.cells[iCol].innerText = marketvalue.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
			// costbasis 
			//iCol = tableHeader.indexOf("costbasis");
			iCol = indexOfArray(tableHeader, "name", "costbasis");
			let costbasis = dollarToFloat(hrow.cells[iCol].innerText);
			// gainloss
			//iCol = tableHeader.indexOf("gainloss");
			iCol = indexOfArray(tableHeader, "name", "gainloss");
			let gainloss = roundFloat(marketvalue - costbasis);
			hrow.setAttribute("gainloss", gainloss);
			hrow.cells[iCol].innerText = gainloss.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
			if (gainloss > 0) {
				hrow.cells[iCol].className = "up";
			} else if (gainloss < 0) {
				hrow.cells[iCol].className = "down";
			} else {
				hrow.cells[iCol].className = "";
			}
			if (!tableHeader[iCol].display) {hrow.cells[iCol].classList.add("ninja");}
			// gainpercent
			//iCol = tableHeader.indexOf("gainpercent");
			iCol = indexOfArray(tableHeader, "name", "gainpercent");
			let gainpercent = gainloss / costbasis * 100;
			gainpercent = roundFloat(gainpercent);
			hrow.setAttribute("gainpercent", gainpercent);
			hrow.cells[iCol].innerText = gainpercent.toFixed(2) + "%"; 
			if (gainpercent > 0) {
				hrow.cells[iCol].className = "up";
			} else if (gainpercent < 0) {
				hrow.cells[iCol].className = "down";
			} else {
				hrow.cells[iCol].className = "";
			}
			if (!tableHeader[iCol].display) {hrow.cells[iCol].classList.add("ninja");}			
			
			// Additional Data
			// symbol,last,chg,chg_sign,pchg,pchg_sign,vwap,adp_50,adp_100,adp_200,wk52hi,wk52lo
			hrow.setAttribute("vwap",quote.vwap);
			hrow.setAttribute("adp_50",quote.adp_50);
			hrow.setAttribute("adp_100",quote.adp_100);
			hrow.setAttribute("adp_200",quote.adp_200);
			hrow.setAttribute("wk52hi",quote.wk52hi);
			hrow.setAttribute("wk52lo",quote.wk52lo);
			
			// Dividend data
			if (quote.div) {
				let divAmt = roundFloat(quote.div);
				let divFreq = quote.divfreq;
				if (divFreq == "A") {divFreq = "Annual";}
				else if (divFreq == "S") {divFreq = "Semi Annual";} 
				else if (divFreq == "Q") {divFreq = "Quarterly";} 
				else if (divFreq == "M") {divFreq = "Monthly";} 
				else if (divFreq == "N") {divFreq = "No Set Frequency";} 
				
				let yield = roundFloat(quote.yield);
				let expDist = roundFloat(quote.qty * quote.div);
				let todayDate = new Date();
				
				let tmpdt = quote.divexdate;
				let tmpyyyy = tmpdt.substring(0, 4);
				let tmpmm = tmpdt.substring(4, 6);
				let tmpdd = tmpdt.substring(6, 8);
				let exDate = new Date(tmpyyyy + '-' + tmpmm + '-' + tmpdd);
				
				tmpdt = quote.divpaydt;
				tmpyyyy = tmpdt.substring(0, 4);
				tmpmm = tmpdt.substring(4, 6);
				tmpdd = tmpdt.substring(6, 8);
				
				let payDate = new Date(tmpyyyy + '-' + tmpmm + '-' + tmpdd);
				
				// populate dividend card
				//30 days
				let tolerance = 1000 * 60 * 60 * 24 * 30; 
				if ( todayDate < payDate) {
					if (Math.abs((todayDate - exDate)) <= tolerance) { 
						document.getElementById("tooltip-D-" + quote.symbol).innerHTML = '' +
						'<p>Upcoming Dividend</p>' +
						'<p>Yield: ' + yield + '%</p>' +
						'<p>Frequency: ' + divFreq + '</p>' +
						'<p>Ex Date: ' + exDate.toLocaleDateString() + '</p>' +
						'<p>Pay Date: ' + payDate.toLocaleDateString() + '</p>' +
						'<p>Amount: $' + divAmt + '</p>' +
						'<p>Expected Distribution: $' + expDist + '</p>';
						document.getElementById("badge-D-" + quote.symbol).classList.remove("ninja");
					}
				} 
			}
		}	
	}
	updateAccountSummary();
}

function getWatchLists() {
	// get all ally invest watchlists and symbols for each 
	// returns watchListData[ {id, items [ {costbasis,instrument{sym}, qty} ]} ]
	
	fetch('api/get_watchlists.php').then(function(response) {
		return response.json();
	}).then(function(response) {
		if  (response.hasOwnProperty('message')) {
			console.log("getWatchLists - error: " + response.message);
		} else {
			if (Array.isArray(response)) {
				setupWatchListsTable(response);
			}
		}
	}).catch(function(err) {
		console.log('getWatchLists - Fetch problem: ' + err.message);
	});
}

function setupWatchListsTable(watchListData) {
	// each watchlist gets their own table
	// watchListData[ {id, items [ {costbasis,instrument{sym}, qty} ]} ]
	let section = document.getElementById("watch-lists");
	let txt = '';
	
	for (i = 0; i < watchListData.length; i++) {
		let watchListID = watchListData[i].id;
		let tblName = "watchlist-table-" + i;
		txt = '<table id="' + tblName + '" name="' + watchListID + '" class="watchlist-table"><thead><tr>' +
			'<th onclick="loaderOn(tblSort,' + "'" + tblName + "',0,'text'" + ');" class="min-width-10">' + watchListID + '</th>' +
			'<th>chart</th>' +
			'<th onclick="loaderOn(tblSort,' + "'" + tblName + "',2,'number'" + ');">lastprice</th>' +
			'<th onclick="loaderOn(tblSort,' + "'" + tblName + "',3,'dollar'" + ');">change</th>' +
			'<th onclick="loaderOn(tblSort,' + "'" + tblName + "',4,'percent'" + ');">percent</th>' +
			'<th>external links</th>' +
			'</tr>' +
			'</thead><tbody></tbody></table>';
			
		section.insertAdjacentHTML('beforeend', txt);
		let header = document.getElementById("watchlist-table-" + i).getElementsByTagName("thead")[0];
		header.insertAdjacentHTML('beforeend','<i class="fas fa-chevron-circle-down tbodyicon icon-left" onclick="toggleTBody(this, \'watchlist-table-' + i + '\');"></i>');
		let tbody = document.getElementById("watchlist-table-" + i).getElementsByTagName("tbody")[0];
		
		for (listItem of watchListData[i].items) {
			let symbol = listItem.instrument.sym;
			// External Medium Chart
			let charttext = '<!-- TradingView Widget BEGIN --> ' + 
			'<!-- https://www.tradingview.com/widget/symbol-overview/ -->' +
			'<div class="ext-chart-graph">' + 
			'<div class="tradingview-widget-container">' + 
			'  <div id="' + 'tradingview_wl' + i + '_' + symbol + '"></div>' + 
			'</div>' + 
			'</div>' +
			'<!-- TradingView Widget END -->';			
			
			txt = '<tr id="' + watchListID + '_wlid_' + symbol + '" name="wlid_' + symbol + '" lastprice="0" change="0" percent="0">' +
				'<td class="holding"><div class="watch_symb">' + symbol + '</div><div class="desc"> </div></td>' +
				'<td class="ext-chart">' + charttext + '</td>' +
				'<td>0</td><td>$0.00</td><td>0.00%</td>'

			txt += '<td class="ext-links">'
			txt += getExternalLinksHTML(symbol);
			txt += '</td></tr>';
			tbody.insertAdjacentHTML('beforeend', txt);
		
			// initiate chart
			new TradingView.MediumWidget(
			  {
			  "symbols": [
				[
				  symbol + "|" + localStorage.getItem("chart_interval")
				]
			  ],
			  "chartOnly": true,
			  "autosize": true,
			  "width": "100%",
			  "height": "100%",
			  "locale": "en",
			  "colorTheme": "dark",
			  "gridLineColor": "#2a2e39",
			  "trendLineColor": "#1976d2",
			  "fontColor": "#787b86",
			  "underLineColor": "rgba(0, 0, 0, 0)",
			  "isTransparent": false,
			  "container_id": "tradingview_wl" + i + "_" + symbol
			  }
			);
			
			// external links
		}
	}
}

function updateWatchListsFromQuotes(quotes) {
	// watchlist data from quotes
	let quote;
	for (quote of quotes) {
		let hrow = document.getElementById("watch_" + quote.symbol);
		let wrows = document.getElementsByName("wlid_" + quote.symbol);
		
		//Last trade date
		let todayDate = DateToString(new Date());
		let updatedToday = todayDate >= quote.date ? true: false;
		// lastprice
		if (quote.last) {
			quote.lastprice = parseFloat(quote.last);
		}
		// change
		let change = 0;
		if (updatedToday && quote.chg) {
			quote.change = parseFloat(quote.chg);
			change = roundFloat(quote.change);
		} 
		// percent
		let percent = 0;
		if (updatedToday && quote.pchg) {
			quote.percent = parseFloat(quote.pchg);
			percent = roundFloat(quote.percent);
		}	
			
		if (hrow) {		
			if (percent > 0) {
				hrow.className = "up";
			} else if (percent < 0) {
				hrow.className = "down";
			} else {
				hrow.className = "";
			}
			hrow.innerText = percent.toFixed(2) + "%";		
		}	
		for (let wrow of wrows) {
			wrow.setAttribute("lastprice", quote.lastprice);
			wrow.setAttribute("change", change);
			wrow.setAttribute("percent", percent);
			wrow.getElementsByClassName("desc")[0].innerText = " " + quote.name;
			// watch list field classes
			if (change > 0) {
				wrow.cells[3].className = "up";
			} else if (change < 0) {
				wrow.cells[3].className = "down";
			} else {
				wrow.cells[3].className = "";
			}
			if (percent > 0) {
				wrow.cells[4].className = "up";
			} else if (percent < 0) {
				wrow.cells[4].className = "down";
			} else {
				wrow.cells[4].className = "";
			}
			// watch list field values
			wrow.cells[2].innerText = quote.lastprice.toFixed(2);
			wrow.cells[3].innerText = change.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
			wrow.cells[4].innerText = percent.toFixed(2) + "%"; 
		}
	}
}

function updateAccountSummary() {
	// update account summary from holdings table data
	var totalcashBuyingPower = dollarToFloat(document.getElementById("amtCashBuyingPower").innerText);
	var totalAccountValue = 0;
	var totalMarketValue = 0;
	var totaltodaysGL = 0;	
	var totaltodaysPCT = 0;
	var totalGL = 0;
	var totalcostbasis = 0;
	
	// column indexes
	let tableHeader = getHeaderFields();
	let iCol_QT = indexOfArray(tableHeader,"name", "qty");
	let iCol_MV = indexOfArray(tableHeader,"name", "marketvalue");
	let iCol_CB = indexOfArray(tableHeader,"name", "costbasis");
	let iCol_GL = indexOfArray(tableHeader,"name", "change");
	let iCol_PA = indexOfArray(tableHeader,"name", "% of account");
	
	var tbl = document.getElementById("holdings-table").rows;
	for (i = 1; i < tbl.length; i++) {
		totaltodaysGL += (dollarToFloat(tbl[i].cells[iCol_GL].innerText) * parseFloat(tbl[i].cells[iCol_QT].innerText) );
		totalMarketValue += dollarToFloat(tbl[i].cells[iCol_MV].innerText);
		totalcostbasis += dollarToFloat(tbl[i].cells[iCol_CB].innerText);
	}
	
	totalAccountValue = totalAccountValue + totalMarketValue + totalcashBuyingPower;
	totalGL = totalMarketValue - totalcostbasis;
	totaltodaysPCT = (( (totalAccountValue - totalcashBuyingPower) / ((totalAccountValue - totalcashBuyingPower) - totaltodaysGL)) - 1) * 100 ;
	if (Number.isNaN(totaltodaysPCT)) {totaltodaysPCT = 0;}
	
	// Populate Account Totals Summary Data
	totaltodaysGL = roundFloat(totaltodaysGL);
	totaltodaysPCT = roundFloat(totaltodaysPCT);
	totalGL = roundFloat(totalGL);
	document.getElementById("amtTotalValue").innerText = totalAccountValue.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtCashBuyingPower").innerText = totalcashBuyingPower.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	// Todays G/L
	document.getElementById("amtTodaysGL").innerText = totaltodaysGL.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtTodaysGL").className = "dollar-amount";
	document.getElementById("iTodaysGL").className = "";
	if (totaltodaysGL > 0) {
		document.getElementById("amtTodaysGL").classList.add("up");
		document.getElementById("iTodaysGL").classList.add("fas","fa-caret-up");
	} else if (totaltodaysGL < 0) {
		document.getElementById("amtTodaysGL").classList.add("down");
		document.getElementById("iTodaysGL").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTodaysGL").classList.add("fas");
	}
	
	// Todays PCT
	document.getElementById("amtTodaysPCT").innerText = totaltodaysPCT.toFixed(2) + "%";
	document.getElementById("amtTodaysPCT").className = "percent-amount";
	document.getElementById("iTodaysPCT").className = "";
	if (totaltodaysPCT > 0) {
		document.getElementById("amtTodaysPCT").classList.add("up");
		document.getElementById("iTodaysPCT").classList.add("fas","fa-caret-up");
	} else if (totaltodaysPCT < 0) {
		document.getElementById("amtTodaysPCT").classList.add("down");
		document.getElementById("iTodaysPCT").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTodaysPCT").classList.add("fas");
	}
	// Total G/L
	document.getElementById("amtTotalGL").innerText = totalGL.toLocaleString('en-US',{style: 'currency', currency: 'USD',});
	document.getElementById("amtTotalGL").className = "dollar-amount";
	document.getElementById("iTotalGL").className = "";
	if (totalGL > 0) {
		document.getElementById("amtTotalGL").classList.add("up");
		document.getElementById("iTotalGL").classList.add("fas","fa-caret-up");
	} else if (totalGL < 0) {
		document.getElementById("amtTotalGL").classList.add("down");
		document.getElementById("iTotalGL").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iTotalGL").classList.add("fas");
	}
	// Return on Investment
	var roi = roundFloat((totalGL / totalcostbasis * 100));
	document.getElementById("amtROI").innerText = roi.toFixed(2) + "%";
	document.getElementById("amtROI").className = "percent-amount";
	document.getElementById("iROI").className = "";
	if (roi > 0) {
		document.getElementById("amtROI").classList.add("up");
		document.getElementById("iROI").classList.add("fas","fa-caret-up");
	} else if (roi < 0) {
		document.getElementById("amtROI").classList.add("down");
		document.getElementById("iROI").classList.add("fas","fa-caret-down");
	} else {
		document.getElementById("iROI").classList.add("fas");
	}
	
	// Percent of Account
	for (i = 1; i < tbl.length; i++) {	
		let percentofaccount = (dollarToFloat(tbl[i].cells[iCol_MV].innerText) / totalAccountValue) * 100;
		if (Number.isNaN(percentofaccount)) {percentofaccount = 0;}
		tbl[i].cells[iCol_PA].innerText = percentofaccount.toFixed(2) + "%";
	}
	
	alertReview();
	alertUpdateQueue();
	spinner("off");
}

function getMarketClock() {
	// get market clock data
	fetch("api/get_market_clock.php")
	.then(function(response) {
		return response.json();
	}) 
	.then(function(response) {
		// handle market status. if not closed, get realtime quotes
		if (response.message != null) {
			if (response.status.current == "close") {
				spinner("halt");
				clearInterval(getDataInterval);
			} else {
				// market pre, open, or after
			}
			document.getElementById("txtMessage").innerText = response.message;
		} else {
			console.log("getMarketClock response error: " + response.message);
			//spinner("halt");
		}
	})
	.catch(function(err) {
		console.log('getMarketClock - Fetch problem: ' + err.message);
		spinner("halt");
	});
}	

function refreshAccountInterval() {
	// account refresh loop, default set as every 10 seconds.
	clearInterval(getDataInterval);
	getMarketClock();
	
	let e = document.getElementById("account-sync");
	let interval = 0;
	if (accountsChanged()) {
		// accounts selected has changed
		clearAccountsSelected();
		e.classList.remove("down");
		interval = 10000;
		getAccountData();
	} else {
		if (e.classList.contains("down")) {
			// updating halted
		} else if (e.classList.contains("fa-spin")) {
			// updating in process
			interval = 30000;
		} else {
			// refresh data 
			interval = 10000;
			
			if (getHoldingSymbols("symb").length > 0) {
				// Get holding information from realtime quotes
				getHoldingQuotes();
			} else {
				// Get holding information from Account Summary
				getAccountData();				
			}
		}
	}
	
	if (interval > 0) {
		getDataInterval = setTimeout(refreshAccountInterval, interval);
	}
}