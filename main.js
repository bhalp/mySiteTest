var gsCurrentVersion = "6.7 2021-04-08 20:35"  // 1/5/21 - v5.6 - added the ability to show the current version by pressing shift F12
var gsInitialStartDate = "2020-05-01";

var gsRefreshToken = "";
var gsAccessTokenExpirationTime = "";
var gsBearerCode = "";
var gsTDAPIKey = "";
var gsRedirectURL = "";
var gbUsingCell = false;


String.prototype.toProperCase = function (opt_lowerCaseTheRest) {
    return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
        .replace(/(^|[\s\xA0])[^\s\xA0]/g, function (s) { return s.toUpperCase(); });
};

var giZIndex = 0;

function FixedPrice() {
    this.symbol = "";
    this.price = 0.0;
    this.date = ""; //2020-04-13
}
var gaFixedPrices = new Array(); //collection of FixedPrice objects

var xhttpAsync;
var bDoingLookup = false;
var bTimedOut = false;

var iTimerID = 0;

var gbDoingSymbolsSelect = false;
var gbDoingStockPriceHistory = false;
var gbGettingStockPriceHistory = false;
var gbUseEnterToTogglePriceHistory = false;
var gbUseExtended = false;
var gbUseLastTradingDay = false;
var gbCollectDetail = false;
var gbDoingDrag = false;
var gbDoingGetTDData = false;
var gbRegularMarketHours = false;

var giMarketOpenRefreshRate = 2000;
var giMarketClosedRefreshRate = 10000;
var giCurrentRefreshRate = 2000;
var giGetTDDataTimeoutId = 0;
var giProgressIntervalId = 0;
var giProgress = 0;
var gbStopProgress = false;

var gsNegativeColor = "darkred";

function MarketStatus() {
    this.isInitialized = false;
    this.isOpen = false;
    this.sMarketDate = "";
    this.dtPreStart = new Date();
    this.dtPreEnd = new Date();
    this.dtRegularStart = new Date();
    this.dtRegularEnd = new Date();
    this.dtPostStart = new Date();
    this.dtPostEnd = new Date();

    this.dtLastMarketStatusCheck = new Date();
    this.dtLastWLPriceCheck = new Date();
    this.dtLastIndexCheck = new Date();
}
var gMarketStatus = new MarketStatus();

function AccessToken() {
    this.access_token = "";
    this.refresh_token = "";
    this.token_type = "";
    this.expires_in = 0
    this.scope = "";
    this.refresh_token_expires_in = 0;
    this.access_token_expiration_time = 0;
}

var gAccessToken = new AccessToken();

var giAPIErrorTimeoutId = 0;

var gsLogonUser = ""; //the user id used to log into TD Ameritrade

function Position() {
    this.averagePrice = 0.0; //cost/share
    this.currentDayProfitLoss = 0.0; //day gain
    this.currentDayProfitLossPercentage = 0.0;
    this.marketValue = 0.0;
    this.longQuantity = 0;
    this.assetType = "";
    this.symbol = "";
    this.accountId = "";
    this.accountName = "";
}

function Account() {
    this.accountId = "";
    this.accountName = "";
    this.IBliquidationValue = 0.0;
    this.CBliquidationValue = 0.0;
    this.CBcashBalance = 0.0;
    this.totalTrades = 0;
    this.positions = new Array();
}
var gAccounts = new Array(); //collection of Account objects

function PriceInfoPeriod() {
    this.high = 0.0;
    this.low = 0.0;
    this.highTotal = 0.0;
    this.lowTotal = 0.0;
    this.openTotal = 0.0;
    this.closeTotal = 0.0;
    this.volume = 0;
    this.count = 0;
}

function PriceInfo() {
    this.idx = 0;
    this.symbol = "";
    this.shortPIP = new PriceInfoPeriod();
    this.longPIP = new PriceInfoPeriod();
    this.totalVolume = 0;
}
var gPriceInfo = new Array(); //collection of PriceInfo objects

function Symbol() {
    this.accountId = "";
    this.accountName = "";
    this.symbol = "";
    this.cusip = "";
    this.description = "";
    this.currentPrice = 0.0;
    this.fees = 0.0;
    this.buy = 0.0;
    this.sell = 0.0
    this.shares = 0.0;
    this.assetType = "";
    this.SymbolPrice = new SymbolPrice();
    this.trades = new Array();
}
var gSymbols = new Array(); //collection of Symbol objects

function SymbolPrice() {
    this.description = "";
    this.price = 0.0;
    this.totalVolume = 0;
    this.tradeTimeInLong = 0;
    this.quoteTimeInLong = 0;
}

function MarketIndex() {
    this.tdName = "";
    this.symbol = "";
    this.description = "";
    this.lastPrice = 0.0;
    this.regularMarketLastPrice = 0.0;
    this.regularMarketNetChange = 0.0;
    this.regularMarketPercentChangeInDouble = 0.0;
    this.netChange = 0.0;
    this.netPercentChangeInDouble = 0.0;
}
var gMarketIndexes = new Array() //collection of MarketIndex objects
var gsMarketsToTrack = new Array("$DJI", "$COMPX", "$SPX.X");
var gsMarketsDJI = "$DJI";
var gsMarketsDJIDesc = "Dow 30";
var gsMarketsNasdaq = "$COMPX";
var gsMarketsNasdaqDesc = "Nasdaq";
var gsMarketsSP = "$SPX.X";
var gsMarketsSPDesc = "S&P 500";
var gsMarketsLargeBio = "IBB";
var gsMarketsLargeBioDesc = "Large Bio";
var gsMarketsSmallBio = "XBI";
var gsMarketsSmallBioDesc = "Small Bio";
var gsMarketsRussell2000 = "$RUT.X";
var gsMarketsRussell2000Desc = "Russell 2K";
var gsMarketsNasdaq100 = "$NDX.X";
var gsMarketsNasdaq100Desc = "Nasdaq 100";
var gsMarkets10yrTreasury = "$TNX.X";
var gsMarkets10yrTreasuryDesc = "10yr Treas";
var gsMarketsOilGas = "$$CL";
var gsMarketsOilGasActual = "/CL";
var gsMarketsOilGasDesc = "Oil & Gas";

var gbMarketShowChangePercentage = false;
var gsMarketsCurrentIndexes = "";
var gsMarketsLastIndexes = "";
var gsMarketWidth = "80";
var gsMarketWidthChange = "70";
var gsMarketCookieName = "tdAppIndexes06"

function WLItemDetail() {
    this.accountId = "";
    this.accountName = "";
    this.bidPrice = 0.0; //Bid
    this.askPrice = 0.0; //Ask
    this.highPrice = 0.0; //High
    this.lowPrice = 0.0; //Low
    this.lastPrice = 0.0; //Last
    this.netChange = 0.0; //Net Chng
    this.netPercentChangeInDouble = 0.0; //Net Chng %
    this.regularMarketLastPrice = 0.0;
    this.regularMarketNetChange = 0.0;
    this.regularMarketPercentChangeInDouble = 0.0;
    this.shares = 0; //number of currently owned shares from Position.longQuantity
    this.dayGain = 0.0; //daily gain from Position.currentDayProfitLoss
    this.costPerShare = 0.0; //from watchlist averagePrice or Position.averagePrice if it exists
    this.marketValue = 0.0; //from Position.marketValue
    this.gain = 0.0; //total gain = shares * (regularMarketLastPrice - shareCost)
    this.gainPercent = 0.0; // (regularMarketLastPrice / shareCost) - 1 * 100
    this.averagePrice = 0.0;
    this.peRatio = 0.0; //only used if WL name contains the word "dividend"
    this.divAmount = 0.0; //only used if WL name contains the word "dividend"
    this.divYield = 0.0; //only used if WL name contains the word "dividend"
    this.divDate = ""; //only used if WL name contains the word "dividend"
}

function WLDisplayed() {
    this.symbol = "";
    this.assetType = "";
    this.WLItemDetails = new Array(); //array of WLItemDetail objects
}
var gWLDisplayed = new Array(); //array of WLDisplayed objects
var goWLDisplayed = []; //will contain the last WL item values to be used to determine if the display should be highlighted

function WLSummaryRank() {
    this.watchlistName = "";
    this.watchlistId = "";
    this.rank = 0;
}

function WLSummaryDayItemDetail() {
    this.watchlistName = "";
    this.watchlistId = "";
    this.up = 0;
    this.down = 0;
    this.cost = 0.0;
    this.gain = 0.0;
    this.gainPercent = 0.0;
    this.rank = 0;
    this.rankTotal = 0;
}

function WLSummaryHoldingItemDetail() {
    this.watchlistName = "";
    this.watchlistId = "";
    this.up = 0;
    this.down = 0;
    this.gain = 0.0;
    this.gainPercent = 0.0;
}

function WLSummaryPortfolioItemDetail() {
    this.watchlistName = "";
    this.watchlistId = "";
    this.gain = 0.0;
}

function WLSummaryDisplayed() {
    this.accountId = "";
    this.accountName = "";
    this.WLSummaryDayItemDetails = new Array(); //array of WLSummaryDayItemDetail objects - sorted by gainPercent
    this.WLSummaryHoldingItemDetails = new Array(); //array of WLSummaryHoldingItemDetail objects - sorted by gainPercent
    this.WLSummaryPortfolioItemDetails = new Array(); //array of WLSummaryPortfolioItemDetail objects - sorted by gain
}

var gWLSummaryDisplayed = new Array(); //array of WLSummaryDisplayed objects
var goWLSummaryDisplayed = []; //will contain the last WLSummary item values to be used to determine if the display should be highlighted


function WLItem() {
    this.bSelected = true;
    this.bSelectedTemp = true;
    this.bSelectedForOrder = false;
    this.symbol = "";
    this.assetType = "";
    this.sequenceId = 0;
    this.purchasedDate = "";
    this.priceInfo = new WLItemDetail();
}

function WLItemSavedOrder() {
    this.bSelected = true;
    this.bSelectedTemp = true;
    this.bSelectedForOrder = false;
    this.savedOrderId = 0;
    this.savedTime = ""; //like "2021-03-04T20:30:01+0000"
    this.orderType = ""; //"MARKET", "LIMIT", or "TRAILING_STOP"
    this.price = 0.0; //the price as a dollar amount
    this.session = ""; //"NORMAL", or "SEAMLESS"
    this.stopPriceOffset = 0; //a number from 1 to 100 
    this.stopPriceLinkType = ""; //'VALUE' or 'PERCENT' or 'TICK'
    this.cancelTime = ""; //as yyyy-mm-dd
    this.duration = ""; //either "DAY" or "GOOD_TILL_CANCEL"
    this.instruction = ""; //"BUY" or "SELL" 
    this.quantity = 0; //a number
    this.symbol = ""; //like "XYZ"
}

var gsAccountWLSummary = "Watchlist Performance";
var gsAccountSavedOrders = "Account Saved Orders";
var gOrdersToDelete = new Array();

function WLWatchList() {
    this.bSelected = false;
    this.bSelectedSymbols = false;
    this.bSelectedTemp = false;
    this.bSelectedTempSymbols = false;
    this.bSelectedSO = false;
    this.bSelectedSOTemp = false;
    this.bSelectedWLSummary = false;
    this.bSelectedWLSummaryTemp = false;
    this.bShowAllAccountsForEachSymbol = false;
    this.iSortOrderFields = 0; //0 - symbol, 1 - qty, 2 - last, 3 - net chng, 
    //4 - net chng %, 5 - bid, 6 - ask, 7 - high, 
    //8 - low, 9 - day gain, 10 - gain, 11 - gain %, 12 - cost/share
    this.iSortOrderAscDesc = 0; //0 - ascending, 1 - descending
    this.spanName = "";
    this.name = ""; //"Account" and "Account Saved Orders" are special names
    this.watchlistId = ""; //if name is "Account" this is accountId, if name is "Account Saved Orders" this is accountId + "AccountSavedOrders"
    this.accountId = "";
    this.accountName = "";
    this.WLItems = new Array(); //array of WLItem objects or WLItemSavedOrder objects
}
var gWatchlists = new Array(); //array of WLWatchList objects
var gsWLWidth = "900px";
var giWLColOpenLabelWidth = 80;
var giWLColOpenEntryWidth = 80;
var giWLColAcquiredDateEntryWidth = 80;
var giWLColTitleWidth = 460;
var giWLColCloseLabelWidth = 110;
var giWLColCloseEntryWidth = 60;
var giWLDragXoffsetLeft = 220;
var giWLDragXoffsetRight = 700;
var giWLCol1Width = giWLColOpenLabelWidth + giWLColOpenEntryWidth + giWLColAcquiredDateEntryWidth + giWLColTitleWidth + giWLColCloseLabelWidth + giWLColCloseEntryWidth + 40;
var giWLCol2Width = 18;

var gsBodyBackgroundColor = "#99CCFF";
var gsWLTableHeadingBackgroundColor = "#99CCFF";
var gsWLTableBackgroundColor = "#e8f4ff";
var gsWLTableOddRowBackgroundColor = "#ffffff";
var gsWLTableEvenRowBackgroundColor = "#e8f4ff";
var gsWLTableSelectedRowBackgroundColor = "#99CCFF";
//var gsWLTableBackgroundColor = "#ffffff";
//var gsWLTableOddRowBackgroundColor = "#ffffff";
//var gsWLTableEvenRowBackgroundColor = "#e8e9eb";

var gbShowingSelectWatchlists = false;

function Trade() {
    this.accountId = "";
    this.accountName = "";
    this.symbol = "";
    this.date = "";
    this.amount = 0.0;
    this.price = 0.0;
    this.cost = 0.0;
    this.netAmount = 0.0;
    this.fees = 0.0;
    this.transactionSubType = "";
    this.assetType = "";
}
var gTrades = new Array(); //collection of Trade objects
var gsLastStartDate = "";
var gsLastEndDate = "";
var gsStartDates = new Array();
var gsEndDates = new Array();

function GetTradesContext() {
    this.sServerUrlBase = "";
    this.sServerUrlBaseAllSymbols = "";
    this.sStartDate = "";
    this.sEndDate = "";

    this.sSymbolToLookup = "";
    this.sSymbolsToLookupTmp = "";

    this.sSymbolsToLookup = "";
    this.sSymbolsToLookupServer = "";

    this.bEndDateISTodaysDate = false;
    this.idxDatesStart = 0;
    this.idxStart = 0;

    this.bDoneGettingSymbolData = false;
    this.bNeedToAddSymbol = false;
    this.bOk = false;

    this.iProgressIncrement = 0;
}
var gGetTradesContext = new GetTradesContext();

function TDOrder() {
    this.bProcessed = false;
    this.sError = "";
    this.iRetryCnt = 0;
    this.symbol = "";
    this.a00complexOrderStrategyTypeStart = "{ ";
    this.a01complexOrderStrategyType = "\"complexOrderStrategyType\": \"NONE\", ";
    this.a02orderType = "\"orderType\": "; //"MARKET", "LIMIT", or "TRAILING_STOP" followed by a comma
    this.a02Aprice = "\"price\": "; //the price as a dollar amount in quotes followed by a comma
    this.a03Asession = "\"session\": \"NORMAL\", ";
    this.a03AsessionSeamless = "\"session\": \"SEAMLESS\", ";
    this.a03BstopPriceLinkBasis = "\"stopPriceLinkBasis\": \"MARK\", ";
    this.a03CstopPriceLinkType = "\"stopPriceLinkType\": \"PERCENT\", ";
    this.a03DstopPriceOffset = "\"stopPriceOffset\": "; //a number from 1 to 100 followed by a comma
    this.a03EstopType = "\"stopType\": \"MARK\", ";
    this.a03FcancelTime = "\"cancelTime\": "; //as yyyy-mm-dd - 4 months from now followed by a comma
    this.a04duration = "\"duration\": "; //either "DAY" or "GOOD_TILL_CANCEL" followed by a comma
    this.a05orderStrategyType = "\"orderStrategyType\": \"SINGLE\", ";
    this.a06orderLegCollectionStart = "\"orderLegCollection\": [";
    this.a07instructionStart = "{\"instruction\": "; //"BUY" or "SELL" followed by a comma
    this.a08quantity = "\"quantity\": "; //a number followed by a comma
    this.a09instrumentStart = "\"instrument\": {";
    this.a10symbol = "\"symbol\": "; //like "XYZ" followed by a comma
    this.a11assetType = "\"assetType\": \"EQUITY\"";
    this.a12instrumentEnd = " }";
    this.a13instructionEnd = " }";
    this.a14orderLegCollectionEnd = " ]";
    this.a15complexOrderStrategyTypeEnd = " }";
}
var gTDOrders = new Array();

function TDSavedOrder() {
    this.bProcessed = false;
    this.sError = "";
    this.iRetryCnt = 0;
    this.symbol = "";
    this.a00complexOrderStrategyTypeStart = "{ ";
    this.a01complexOrderStrategyType = "\"complexOrderStrategyType\": \"NONE\", ";
    this.a02orderType = "\"orderType\": "; //"MARKET", "LIMIT", or "TRAILING_STOP" followed by a comma
    this.a02Aprice = "\"price\": "; //the price as a dollar amount in quotes followed by a comma
    this.a03Asession = "\"session\": \"NORMAL\", ";
    this.a03AsessionSeamless = "\"session\": \"SEAMLESS\", ";
    this.a03BstopPriceLinkBasis = "\"stopPriceLinkBasis\": \"MARK\", ";
    this.a03CstopPriceLinkType = "\"stopPriceLinkType\": \"PERCENT\", ";
    this.a03DstopPriceOffset = "\"stopPriceOffset\": "; //a number from 1 to 100 followed by a comma
    this.a03EstopType = "\"stopType\": \"MARK\", ";
    this.a03FcancelTime = "\"cancelTime\": "; //as yyyy-mm-dd - 4 months from now followed by a comma
    this.a04duration = "\"duration\": "; //either "DAY" or "GOOD_TILL_CANCEL" followed by a comma
    this.a05orderStrategyType = "\"orderStrategyType\": \"SINGLE\", ";
    this.a06orderLegCollectionStart = "\"orderLegCollection\": [";
    this.a07instructionStart = "{\"instruction\": "; //"BUY" or "SELL" followed by a comma
    this.a08quantity = "\"quantity\": "; //a number followed by a comma
    this.a09instrumentStart = "\"instrument\": {";
    this.a10symbol = "\"symbol\": "; //like "XYZ" followed by a comma
    this.a11assetType = "\"assetType\": \"EQUITY\"";
    this.a12instrumentEnd = " }";
    this.a13instructionEnd = " }";
    this.a14orderLegCollectionEnd = " ]";
    this.a15complexOrderStrategyTypeEnd = " }";
    this.savedOrderId = 0;
}
var gbDoingCreateOrders = false;

function TDWLOrder() {
    this.bProcessed = false;
    this.bDoingAddNewSymbols = false;
    this.bDoingPurchasedDateClear = false;
    this.bDoingPurchasedDateUpdate = false;
    this.sError = "";
    this.iRetryCnt = 0;
    this.symbol = "";
    this.aWL00Start = "{ ";
    this.aWL01name = "\"name\": "; //watchlist name "wl name" followed by a comma
    this.aWL02watchlistId = "\"watchlistId\": "; //watchlist id like "1577682940" followed by a comma
    this.aWL03watchlistItemsStart = "\"watchlistItems\": [ ";
    this.aWL03watchlistItemStart = "{";
    this.aWL04sequenceId = "\"sequenceId\": "; //a number followed by a comma - only used when closing a symbol
    this.aWL05quantity = "\"quantity\": 0, ";
    this.aWL06averagePrice = "\"averagePrice\": 0, ";
    this.aWL07commission = "\"commission\": "; //a money amount like 123.54 followed by a comma - set to commission when closing, 0 when adding
    this.aWL07purchasedDate = "\"purchasedDate\": "; //like "2021-02-01" followed by a comma
    this.aWL08instrumentStart = "\"instrument\": {";
    this.aWL09symbol = "\"symbol\": "; //like "XYZ" followed by a comma
    this.aWL10assetType = "\"assetType\": \"EQUITY\"";
    this.aWL11instrumentEnd = " }";
    this.aWL12watchlistItemEnd = " }";
    this.aWL12watchlistItemsEnd = " ]";
    this.aWL13end = " }";
}
var gTDWLOrders = new Array();

function TDOrderSummary() {
    this.symbol = "";
    this.shares = 0;
}

var giTDPostOrderRetryCnt = 0;

var gPriceMinutes = new Array(); //collection innerHTML strings for last set of price data for each symbol

var gsLastError = "";
var gsLastErrors = new Array();
var gbDoResetWatchlists = false;
var gbDoingGetTrades = false;
var gbStopGetTrades = false;
var gbWLShowAllAccountsForSymbol = false;

//socket variables
var gLoginRequest;
var gQuoteRequest;
var gbLoggedIn = false;
var mySock;
var gsSysmbolsThatNeedQuotes = "";
var giRequestId = 0;


var oACC;
/*-----------------------------------------------------------------------
[
//Account:
{
  "securitiesAccount": "The type <securitiesAccount> has the following subclasses [MarginAccount, CashAccount] descriptions are listed below"
}
]
 
//The class <securitiesAccount> has the
//following subclasses:
//-MarginAccount
//-CashAccount
//JSON for each are listed below:
 
//MarginAccount:
{
  "type": "'CASH' or 'MARGIN'",
  "accountId": "string",
  "roundTrips": 0,
  "isDayTrader": false,
  "isClosingOnlyRestricted": false,
  "positions": [
    {
      "shortQuantity": 0,
      "averagePrice": 0,
      "currentDayProfitLoss": 0,
      "currentDayProfitLossPercentage": 0,
      "longQuantity": 0,
      "settledLongQuantity": 0,
      "settledShortQuantity": 0,
      "agedQuantity": 0,
      "instrument": "The type <Instrument> has the following subclasses [Equity, FixedIncome, MutualFund, CashEquivalent, Option] descriptions are listed below\"",
      "marketValue": 0
    }
  ],
  "orderStrategies": [
    {
      "session": "'NORMAL' or 'AM' or 'PM' or 'SEAMLESS'",
      "duration": "'DAY' or 'GOOD_TILL_CANCEL' or 'FILL_OR_KILL'",
      "orderType": "'MARKET' or 'LIMIT' or 'STOP' or 'STOP_LIMIT' or 'TRAILING_STOP' or 'MARKET_ON_CLOSE' or 'EXERCISE' or 'TRAILING_STOP_LIMIT' or 'NET_DEBIT' or 'NET_CREDIT' or 'NET_ZERO'",
      "cancelTime": {
        "date": "string",
        "shortFormat": false
      },
      "complexOrderStrategyType": "'NONE' or 'COVERED' or 'VERTICAL' or 'BACK_RATIO' or 'CALENDAR' or 'DIAGONAL' or 'STRADDLE' or 'STRANGLE' or 'COLLAR_SYNTHETIC' or 'BUTTERFLY' or 'CONDOR' or 'IRON_CONDOR' or 'VERTICAL_ROLL' or 'COLLAR_WITH_STOCK' or 'DOUBLE_DIAGONAL' or 'UNBALANCED_BUTTERFLY' or 'UNBALANCED_CONDOR' or 'UNBALANCED_IRON_CONDOR' or 'UNBALANCED_VERTICAL_ROLL' or 'CUSTOM'",
      "quantity": 0,
      "filledQuantity": 0,
      "remainingQuantity": 0,
      "requestedDestination": "'INET' or 'ECN_ARCA' or 'CBOE' or 'AMEX' or 'PHLX' or 'ISE' or 'BOX' or 'NYSE' or 'NASDAQ' or 'BATS' or 'C2' or 'AUTO'",
      "destinationLinkName": "string",
      "releaseTime": "string",
      "stopPrice": 0,
      "stopPriceLinkBasis": "'MANUAL' or 'BASE' or 'TRIGGER' or 'LAST' or 'BID' or 'ASK' or 'ASK_BID' or 'MARK' or 'AVERAGE'",
      "stopPriceLinkType": "'VALUE' or 'PERCENT' or 'TICK'",
      "stopPriceOffset": 0,
      "stopType": "'STANDARD' or 'BID' or 'ASK' or 'LAST' or 'MARK'",
      "priceLinkBasis": "'MANUAL' or 'BASE' or 'TRIGGER' or 'LAST' or 'BID' or 'ASK' or 'ASK_BID' or 'MARK' or 'AVERAGE'",
      "priceLinkType": "'VALUE' or 'PERCENT' or 'TICK'",
      "price": 0,
      "taxLotMethod": "'FIFO' or 'LIFO' or 'HIGH_COST' or 'LOW_COST' or 'AVERAGE_COST' or 'SPECIFIC_LOT'",
      "orderLegCollection": [
        {
          "orderLegType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
          "legId": 0,
          "instrument": "\"The type <Instrument> has the following subclasses [Equity, FixedIncome, MutualFund, CashEquivalent, Option] descriptions are listed below\"",
          "instruction": "'BUY' or 'SELL' or 'BUY_TO_COVER' or 'SELL_SHORT' or 'BUY_TO_OPEN' or 'BUY_TO_CLOSE' or 'SELL_TO_OPEN' or 'SELL_TO_CLOSE' or 'EXCHANGE'",
          "positionEffect": "'OPENING' or 'CLOSING' or 'AUTOMATIC'",
          "quantity": 0,
          "quantityType": "'ALL_SHARES' or 'DOLLARS' or 'SHARES'"
        }
      ],
      "activationPrice": 0,
      "specialInstruction": "'ALL_OR_NONE' or 'DO_NOT_REDUCE' or 'ALL_OR_NONE_DO_NOT_REDUCE'",
      "orderStrategyType": "'SINGLE' or 'OCO' or 'TRIGGER'",
      "orderId": 0,
      "cancelable": false,
      "editable": false,
      "status": "'AWAITING_PARENT_ORDER' or 'AWAITING_CONDITION' or 'AWAITING_MANUAL_REVIEW' or 'ACCEPTED' or 'AWAITING_UR_OUT' or 'PENDING_ACTIVATION' or 'QUEUED' or 'WORKING' or 'REJECTED' or 'PENDING_CANCEL' or 'CANCELED' or 'PENDING_REPLACE' or 'REPLACED' or 'FILLED' or 'EXPIRED'",
      "enteredTime": "string",
      "closeTime": "string",
      "tag": "string",
      "accountId": 0,
      "orderActivityCollection": [
        "\"The type <OrderActivity> has the following subclasses [Execution] descriptions are listed below\""
      ],
      "replacingOrderCollection": [
        {}
      ],
      "childOrderStrategies": [
        {}
      ],
      "statusDescription": "string"
    }
  ],
  "initialBalances": {
    "accruedInterest": 0,
    "availableFundsNonMarginableTrade": 0,
    "bondValue": 0,
    "buyingPower": 0,
    "cashBalance": 0,
    "cashAvailableForTrading": 0,
    "cashReceipts": 0,
    "dayTradingBuyingPower": 0,
    "dayTradingBuyingPowerCall": 0,
    "dayTradingEquityCall": 0,
    "equity": 0,
    "equityPercentage": 0,
    "liquidationValue": 0,
    "longMarginValue": 0,
    "longOptionMarketValue": 0,
    "longStockValue": 0,
    "maintenanceCall": 0,
    "maintenanceRequirement": 0,
    "margin": 0,
    "marginEquity": 0,
    "moneyMarketFund": 0,
    "mutualFundValue": 0,
    "regTCall": 0,
    "shortMarginValue": 0,
    "shortOptionMarketValue": 0,
    "shortStockValue": 0,
    "totalCash": 0,
    "isInCall": false,
    "unsettledCash": 0,
    "pendingDeposits": 0,
    "marginBalance": 0,
    "shortBalance": 0,
    "accountValue": 0
  },
  "currentBalances": {
    "accruedInterest": 0,
    "cashBalance": 0,
    "cashReceipts": 0,
    "longOptionMarketValue": 0,
    "liquidationValue": 0,
    "longMarketValue": 0,
    "moneyMarketFund": 0,
    "savings": 0,
    "shortMarketValue": 0,
    "pendingDeposits": 0,
    "availableFunds": 0,
    "availableFundsNonMarginableTrade": 0,
    "buyingPower": 0,
    "buyingPowerNonMarginableTrade": 0,
    "dayTradingBuyingPower": 0,
    "dayTradingBuyingPowerCall": 0,
    "equity": 0,
    "equityPercentage": 0,
    "longMarginValue": 0,
    "maintenanceCall": 0,
    "maintenanceRequirement": 0,
    "marginBalance": 0,
    "regTCall": 0,
    "shortBalance": 0,
    "shortMarginValue": 0,
    "shortOptionMarketValue": 0,
    "sma": 0,
    "mutualFundValue": 0,
    "bondValue": 0,
    "isInCall": false,
    "stockBuyingPower": 0,
    "optionBuyingPower": 0
  },
  "projectedBalances": {
    "accruedInterest": 0,
    "cashBalance": 0,
    "cashReceipts": 0,
    "longOptionMarketValue": 0,
    "liquidationValue": 0,
    "longMarketValue": 0,
    "moneyMarketFund": 0,
    "savings": 0,
    "shortMarketValue": 0,
    "pendingDeposits": 0,
    "availableFunds": 0,
    "availableFundsNonMarginableTrade": 0,
    "buyingPower": 0,
    "buyingPowerNonMarginableTrade": 0,
    "dayTradingBuyingPower": 0,
    "dayTradingBuyingPowerCall": 0,
    "equity": 0,
    "equityPercentage": 0,
    "longMarginValue": 0,
    "maintenanceCall": 0,
    "maintenanceRequirement": 0,
    "marginBalance": 0,
    "regTCall": 0,
    "shortBalance": 0,
    "shortMarginValue": 0,
    "shortOptionMarketValue": 0,
    "sma": 0,
    "mutualFundValue": 0,
    "bondValue": 0,
    "isInCall": false,
    "stockBuyingPower": 0,
    "optionBuyingPower": 0
  }
}
 
//OR
 
//CashAccount:
{
  "type": "'CASH' or 'MARGIN'",
  "accountId": "string",
  "roundTrips": 0,
  "isDayTrader": false,
  "isClosingOnlyRestricted": false,
  "positions": [
    {
      "shortQuantity": 0,
      "averagePrice": 0,
      "currentDayProfitLoss": 0,
      "currentDayProfitLossPercentage": 0,
      "longQuantity": 0,
      "settledLongQuantity": 0,
      "settledShortQuantity": 0,
      "agedQuantity": 0,
      "instrument": "\"The type <Instrument> has the following subclasses [Equity, FixedIncome, MutualFund, CashEquivalent, Option] descriptions are listed below\"",
      "marketValue": 0
    }
  ],
  "orderStrategies": [
    {
      "session": "'NORMAL' or 'AM' or 'PM' or 'SEAMLESS'",
      "duration": "'DAY' or 'GOOD_TILL_CANCEL' or 'FILL_OR_KILL'",
      "orderType": "'MARKET' or 'LIMIT' or 'STOP' or 'STOP_LIMIT' or 'TRAILING_STOP' or 'MARKET_ON_CLOSE' or 'EXERCISE' or 'TRAILING_STOP_LIMIT' or 'NET_DEBIT' or 'NET_CREDIT' or 'NET_ZERO'",
      "cancelTime": {
        "date": "string",
        "shortFormat": false
      },
      "complexOrderStrategyType": "'NONE' or 'COVERED' or 'VERTICAL' or 'BACK_RATIO' or 'CALENDAR' or 'DIAGONAL' or 'STRADDLE' or 'STRANGLE' or 'COLLAR_SYNTHETIC' or 'BUTTERFLY' or 'CONDOR' or 'IRON_CONDOR' or 'VERTICAL_ROLL' or 'COLLAR_WITH_STOCK' or 'DOUBLE_DIAGONAL' or 'UNBALANCED_BUTTERFLY' or 'UNBALANCED_CONDOR' or 'UNBALANCED_IRON_CONDOR' or 'UNBALANCED_VERTICAL_ROLL' or 'CUSTOM'",
      "quantity": 0,
      "filledQuantity": 0,
      "remainingQuantity": 0,
      "requestedDestination": "'INET' or 'ECN_ARCA' or 'CBOE' or 'AMEX' or 'PHLX' or 'ISE' or 'BOX' or 'NYSE' or 'NASDAQ' or 'BATS' or 'C2' or 'AUTO'",
      "destinationLinkName": "string",
      "releaseTime": "string",
      "stopPrice": 0,
      "stopPriceLinkBasis": "'MANUAL' or 'BASE' or 'TRIGGER' or 'LAST' or 'BID' or 'ASK' or 'ASK_BID' or 'MARK' or 'AVERAGE'",
      "stopPriceLinkType": "'VALUE' or 'PERCENT' or 'TICK'",
      "stopPriceOffset": 0,
      "stopType": "'STANDARD' or 'BID' or 'ASK' or 'LAST' or 'MARK'",
      "priceLinkBasis": "'MANUAL' or 'BASE' or 'TRIGGER' or 'LAST' or 'BID' or 'ASK' or 'ASK_BID' or 'MARK' or 'AVERAGE'",
      "priceLinkType": "'VALUE' or 'PERCENT' or 'TICK'",
      "price": 0,
      "taxLotMethod": "'FIFO' or 'LIFO' or 'HIGH_COST' or 'LOW_COST' or 'AVERAGE_COST' or 'SPECIFIC_LOT'",
      "orderLegCollection": [
        {
          "orderLegType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
          "legId": 0,
          "instrument": "\"The type <Instrument> has the following subclasses [Equity, FixedIncome, MutualFund, CashEquivalent, Option] descriptions are listed below\"",
          "instruction": "'BUY' or 'SELL' or 'BUY_TO_COVER' or 'SELL_SHORT' or 'BUY_TO_OPEN' or 'BUY_TO_CLOSE' or 'SELL_TO_OPEN' or 'SELL_TO_CLOSE' or 'EXCHANGE'",
          "positionEffect": "'OPENING' or 'CLOSING' or 'AUTOMATIC'",
          "quantity": 0,
          "quantityType": "'ALL_SHARES' or 'DOLLARS' or 'SHARES'"
        }
      ],
      "activationPrice": 0,
      "specialInstruction": "'ALL_OR_NONE' or 'DO_NOT_REDUCE' or 'ALL_OR_NONE_DO_NOT_REDUCE'",
      "orderStrategyType": "'SINGLE' or 'OCO' or 'TRIGGER'",
      "orderId": 0,
      "cancelable": false,
      "editable": false,
      "status": "'AWAITING_PARENT_ORDER' or 'AWAITING_CONDITION' or 'AWAITING_MANUAL_REVIEW' or 'ACCEPTED' or 'AWAITING_UR_OUT' or 'PENDING_ACTIVATION' or 'QUEUED' or 'WORKING' or 'REJECTED' or 'PENDING_CANCEL' or 'CANCELED' or 'PENDING_REPLACE' or 'REPLACED' or 'FILLED' or 'EXPIRED'",
      "enteredTime": "string",
      "closeTime": "string",
      "tag": "string",
      "accountId": 0,
      "orderActivityCollection": [
        "\"The type <OrderActivity> has the following subclasses [Execution] descriptions are listed below\""
      ],
      "replacingOrderCollection": [
        {}
      ],
      "childOrderStrategies": [
        {}
      ],
      "statusDescription": "string"
    }
  ],
  "initialBalances": {
    "accruedInterest": 0,
    "cashAvailableForTrading": 0,
    "cashAvailableForWithdrawal": 0,
    "cashBalance": 0,
    "bondValue": 0,
    "cashReceipts": 0,
    "liquidationValue": 0,
    "longOptionMarketValue": 0,
    "longStockValue": 0,
    "moneyMarketFund": 0,
    "mutualFundValue": 0,
    "shortOptionMarketValue": 0,
    "shortStockValue": 0,
    "isInCall": false,
    "unsettledCash": 0,
    "cashDebitCallValue": 0,
    "pendingDeposits": 0,
    "accountValue": 0
  },
  "currentBalances": {
    "accruedInterest": 0,
    "cashBalance": 0,
    "cashReceipts": 0,
    "longOptionMarketValue": 0,
    "liquidationValue": 0,
    "longMarketValue": 0,
    "moneyMarketFund": 0,
    "savings": 0,
    "shortMarketValue": 0,
    "pendingDeposits": 0,
    "cashAvailableForTrading": 0,
    "cashAvailableForWithdrawal": 0,
    "cashCall": 0,
    "longNonMarginableMarketValue": 0,
    "totalCash": 0,
    "shortOptionMarketValue": 0,
    "mutualFundValue": 0,
    "bondValue": 0,
    "cashDebitCallValue": 0,
    "unsettledCash": 0
  },
  "projectedBalances": {
    "accruedInterest": 0,
    "cashBalance": 0,
    "cashReceipts": 0,
    "longOptionMarketValue": 0,
    "liquidationValue": 0,
    "longMarketValue": 0,
    "moneyMarketFund": 0,
    "savings": 0,
    "shortMarketValue": 0,
    "pendingDeposits": 0,
    "cashAvailableForTrading": 0,
    "cashAvailableForWithdrawal": 0,
    "cashCall": 0,
    "longNonMarginableMarketValue": 0,
    "totalCash": 0,
    "shortOptionMarketValue": 0,
    "mutualFundValue": 0,
    "bondValue": 0,
    "cashDebitCallValue": 0,
    "unsettledCash": 0
  }
}
 
//The class <Instrument> has the
//following subclasses:
//-Equity
//-FixedIncome
//-MutualFund
//-CashEquivalent
//-Option
//JSON for each are listed below:
 
//Equity:
{
  "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
  "cusip": "string",
  "symbol": "string",
  "description": "string"
}
 
//OR
 
//FixedIncome:
{
  "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "maturityDate": "string",
  "variableRate": 0,
  "factor": 0
}
 
//OR
 
//MutualFund:
{
  "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "type": "'NOT_APPLICABLE' or 'OPEN_END_NON_TAXABLE' or 'OPEN_END_TAXABLE' or 'NO_LOAD_NON_TAXABLE' or 'NO_LOAD_TAXABLE'"
}
 
//OR
 
//CashEquivalent:
{
  "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "type": "'SAVINGS' or 'MONEY_MARKET_FUND'"
}
 
//OR
 
//Option:
{
  "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
  "cusip": "string",
  "symbol": "string",
  "description": "string",
  "type": "'VANILLA' or 'BINARY' or 'BARRIER'",
  "putCall": "'PUT' or 'CALL'",
  "underlyingSymbol": "string",
  "optionMultiplier": 0,
  "optionDeliverables": [
    {
      "symbol": "string",
      "deliverableUnits": 0,
      "currencyType": "'USD' or 'CAD' or 'EUR' or 'JPY'",
      "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'"
    }
  ]
}
 
//The class <OrderActivity> has the
//following subclasses:
//-Execution
//JSON for each are listed below:
 
//Execution:
{
  "activityType": "'EXECUTION' or 'ORDER_ACTION'",
  "executionType": "'FILL'",
  "quantity": 0,
  "orderRemainingQuantity": 0,
  "executionLegs": [
    {
      "legId": 0,
      "quantity": 0,
      "mismarkedQuantity": 0,
      "price": 0,
      "time": "string"
    }
  ]
}
end oACC -------------------------------------------------------------------------*/

var oACCP;
/*-------------------------------------------------------------------------------
//UserPrincipal:
{
  "authToken": "string",
  "userId": "string",
  "userCdDomainId": "string",
  "primaryAccountId": "string",
  "lastLoginTime": "string",
  "tokenExpirationTime": "string",
  "loginTime": "string",
  "accessLevel": "string",
  "stalePassword": false,
  "streamerInfo": {
    "streamerBinaryUrl": "string",
    "streamerSocketUrl": "string",
    "token": "string",
    "tokenTimestamp": "string",
    "userGroup": "string",
    "accessLevel": "string",
    "acl": "string",
    "appId": "string"
  },
  "professionalStatus": "'PROFESSIONAL' or 'NON_PROFESSIONAL' or 'UNKNOWN_STATUS'",
  "quotes": {
    "isNyseDelayed": false,
    "isNasdaqDelayed": false,
    "isOpraDelayed": false,
    "isAmexDelayed": false,
    "isCmeDelayed": false,
    "isIceDelayed": false,
    "isForexDelayed": false
  },
  "streamerSubscriptionKeys": {
    "keys": [
      {
        "key": "string"
      }
    ]
  },
  "accounts": [
    {
      "accountId": "string",
      "description": "string",
      "displayName": "string",
      "accountCdDomainId": "string",
      "company": "string",
      "segment": "string",
      "surrogateIds": "object",
      "preferences": {
        "expressTrading": false,
        "directOptionsRouting": false,
        "directEquityRouting": false,
        "defaultEquityOrderLegInstruction": "'BUY' or 'SELL' or 'BUY_TO_COVER' or 'SELL_SHORT' or 'NONE'",
        "defaultEquityOrderType": "'MARKET' or 'LIMIT' or 'STOP' or 'STOP_LIMIT' or 'TRAILING_STOP' or 'MARKET_ON_CLOSE' or 'NONE'",
        "defaultEquityOrderPriceLinkType": "'VALUE' or 'PERCENT' or 'NONE'",
        "defaultEquityOrderDuration": "'DAY' or 'GOOD_TILL_CANCEL' or 'NONE'",
        "defaultEquityOrderMarketSession": "'AM' or 'PM' or 'NORMAL' or 'SEAMLESS' or 'NONE'",
        "defaultEquityQuantity": 0,
        "mutualFundTaxLotMethod": "'FIFO' or 'LIFO' or 'HIGH_COST' or 'LOW_COST' or 'MINIMUM_TAX' or 'AVERAGE_COST' or 'NONE'",
        "optionTaxLotMethod": "'FIFO' or 'LIFO' or 'HIGH_COST' or 'LOW_COST' or 'MINIMUM_TAX' or 'AVERAGE_COST' or 'NONE'",
        "equityTaxLotMethod": "'FIFO' or 'LIFO' or 'HIGH_COST' or 'LOW_COST' or 'MINIMUM_TAX' or 'AVERAGE_COST' or 'NONE'",
        "defaultAdvancedToolLaunch": "'TA' or 'N' or 'Y' or 'TOS' or 'NONE' or 'CC2'",
        "authTokenTimeout": "'FIFTY_FIVE_MINUTES' or 'TWO_HOURS' or 'FOUR_HOURS' or 'EIGHT_HOURS'"
      },
      "acl": "string",
      "authorizations": {
        "apex": false,
        "levelTwoQuotes": false,
        "stockTrading": false,
        "marginTrading": false,
        "streamingNews": false,
        "optionTradingLevel": "'COVERED' or 'FULL' or 'LONG' or 'SPREAD' or 'NONE'",
        "streamerAccess": false,
        "advancedMargin": false,
        "scottradeAccount": false
      }
    }
  ]
}
end oACCP-------------------------------------------------------------------------------*/


var oMDQ;
/*-------------------------------------------------------------------------------
[
 
 //Mutual Fund:
{
  "symbol": "string",
  "description": "string",
  "closePrice": 0,
  "netChange": 0,
  "totalVolume": 0,
  "tradeTimeInLong": 0,
  "exchange": "string",
  "exchangeName": "string",
  "digits": 0,
  "52WkHigh": 0,
  "52WkLow": 0,
  "nAV": 0,
  "peRatio": 0,
  "divAmount": 0,
  "divYield": 0,
  "divDate": "string",
  "securityStatus": "string"
}
 //Future:
{
  "symbol": "string",
  "bidPriceInDouble": 0,
  "askPriceInDouble": 0,
  "lastPriceInDouble": 0,
  "bidId": "string",
  "askId": "string",
  "highPriceInDouble": 0,
  "lowPriceInDouble": 0,
  "closePriceInDouble": 0,
  "exchange": "string",
  "description": "string",
  "lastId": "string",
  "openPriceInDouble": 0,
  "changeInDouble": 0,
  "futurePercentChange": 0,
  "exchangeName": "string",
  "securityStatus": "string",
  "openInterest": 0,
  "mark": 0,
  "tick": 0,
  "tickAmount": 0,
  "product": "string",
  "futurePriceFormat": "string",
  "futureTradingHours": "string",
  "futureIsTradable": false,
  "futureMultiplier": 0,
  "futureIsActive": false,
  "futureSettlementPrice": 0,
  "futureActiveSymbol": "string",
  "futureExpirationDate": "string"
}
 //Future Options:
{
  "symbol": "string",
  "bidPriceInDouble": 0,
  "askPriceInDouble": 0,
  "lastPriceInDouble": 0,
  "highPriceInDouble": 0,
  "lowPriceInDouble": 0,
  "closePriceInDouble": 0,
  "description": "string",
  "openPriceInDouble": 0,
  "netChangeInDouble": 0,
  "openInterest": 0,
  "exchangeName": "string",
  "securityStatus": "string",
  "volatility": 0,
  "moneyIntrinsicValueInDouble": 0,
  "multiplierInDouble": 0,
  "digits": 0,
  "strikePriceInDouble": 0,
  "contractType": "string",
  "underlying": "string",
  "timeValueInDouble": 0,
  "deltaInDouble": 0,
  "gammaInDouble": 0,
  "thetaInDouble": 0,
  "vegaInDouble": 0,
  "rhoInDouble": 0,
  "mark": 0,
  "tick": 0,
  "tickAmount": 0,
  "futureIsTradable": false,
  "futureTradingHours": "string",
  "futurePercentChange": 0,
  "futureIsActive": false,
  "futureExpirationDate": 0,
  "expirationType": "string",
  "exerciseType": "string",
  "inTheMoney": false
}
 //Index:
{
  "symbol": "string",
  "description": "string",
  "lastPrice": 0,
  "openPrice": 0,
  "highPrice": 0,
  "lowPrice": 0,
  "closePrice": 0,
  "netChange": 0,
  "totalVolume": 0,
  "tradeTimeInLong": 0,
  "exchange": "string",
  "exchangeName": "string",
  "digits": 0,
  "52WkHigh": 0,
  "52WkLow": 0,
  "securityStatus": "string"
}
 //Option:
{
  "symbol": "string",
  "description": "string",
  "bidPrice": 0,
  "bidSize": 0,
  "askPrice": 0,
  "askSize": 0,
  "lastPrice": 0,
  "lastSize": 0,
  "openPrice": 0,
  "highPrice": 0,
  "lowPrice": 0,
  "closePrice": 0,
  "netChange": 0,
  "totalVolume": 0,
  "quoteTimeInLong": 0,
  "tradeTimeInLong": 0,
  "mark": 0,
  "openInterest": 0,
  "volatility": 0,
  "moneyIntrinsicValue": 0,
  "multiplier": 0,
  "strikePrice": 0,
  "contractType": "string",
  "underlying": "string",
  "timeValue": 0,
  "deliverables": "string",
  "delta": 0,
  "gamma": 0,
  "theta": 0,
  "vega": 0,
  "rho": 0,
  "securityStatus": "string",
  "theoreticalOptionValue": 0,
  "underlyingPrice": 0,
  "uvExpirationType": "string",
  "exchange": "string",
  "exchangeName": "string",
  "settlementType": "string"
}
 //Forex:
{
  "symbol": "string",
  "bidPriceInDouble": 0,
  "askPriceInDouble": 0,
  "lastPriceInDouble": 0,
  "highPriceInDouble": 0,
  "lowPriceInDouble": 0,
  "closePriceInDouble": 0,
  "exchange": "string",
  "description": "string",
  "openPriceInDouble": 0,
  "changeInDouble": 0,
  "percentChange": 0,
  "exchangeName": "string",
  "digits": 0,
  "securityStatus": "string",
  "tick": 0,
  "tickAmount": 0,
  "product": "string",
  "tradingHours": "string",
  "isTradable": false,
  "marketMaker": "string",
  "52WkHighInDouble": 0,
  "52WkLowInDouble": 0,
  "mark": 0
}
 //ETF:
{
  "symbol": "string",
  "description": "string",
  "bidPrice": 0,
  "bidSize": 0,
  "bidId": "string",
  "askPrice": 0,
  "askSize": 0,
  "askId": "string",
  "lastPrice": 0,
  "lastSize": 0,
  "lastId": "string",
  "openPrice": 0,
  "highPrice": 0,
  "lowPrice": 0,
  "closePrice": 0,
  "netChange": 0,
  "totalVolume": 0,
  "quoteTimeInLong": 0,
  "tradeTimeInLong": 0,
  "mark": 0,
  "exchange": "string",
  "exchangeName": "string",
  "marginable": false,
  "shortable": false,
  "volatility": 0,
  "digits": 0,
  "52WkHigh": 0,
  "52WkLow": 0,
  "peRatio": 0,
  "divAmount": 0,
  "divYield": 0,
  "divDate": "string",
  "securityStatus": "string",
  "regularMarketLastPrice": 0,
  "regularMarketLastSize": 0,
  "regularMarketNetChange": 0,
  "regularMarketTradeTimeInLong": 0
}
 //Equity:
{
  "symbol": "string",           0
  "description": "string",
  "bidPrice": 0,                1
  "bidSize": 0,                 4
  "bidId": "string",            7
  "askPrice": 0,                2
  "askSize": 0,                 5
  "askId": "string",            6
  "lastPrice": 0,               3
  "lastSize": 0,                9
  "lastId": "string",           26
  "openPrice": 0,               28
  "highPrice": 0,               12
  "lowPrice": 0,                13
  "closePrice": 0,              15
  "netChange": 0,               29
  "totalVolume": 0,             8
  "quoteTimeInLong": 0,         50
  "tradeTimeInLong": 0,         51
  "mark": 0,                    49
  "exchange": "string",         16
  "exchangeName": "string",     39
  "marginable": false,          17
  "shortable": false,           18
  "volatility": 0,              24
  "digits": 0,                  27
  "52WkHigh": 0,                30
  "52WkLow": 0,                 31
  "peRatio": 0,                 32
  "divAmount": 0,               33
  "divYield": 0,                34
  "divDate": "string",          40
  "securityStatus": "string",   48
  "regularMarketLastPrice": 0,  43
  "regularMarketLastSize": 0,   44
  "regularMarketNetChange": 0,  47
  "regularMarketTradeTimeInLong": 0 52
}
]
end oMDQ -------------------------------------------------------------------------------*/

var oCMWL;
/*----------------------------------------------------------------------------------------
        [
        //Watchlist:
        {
          "name": "string",
          "watchlistId": "string",
          "accountId": "string",
          "status": "'UNCHANGED' or 'CREATED' or 'UPDATED' or 'DELETED'",
          "watchlistItems": [
            {
              "sequenceId": 0,
              "quantity": 0,
              "averagePrice": 0,
              "commission": 0,
              "purchasedDate": "DateParam\"",
              "instrument": {
                "symbol": "string",
                "description": "string",
                "assetType": "'EQUITY' or 'OPTION' or 'MUTUAL_FUND' or 'FIXED_INCOME' or 'INDEX'"
              },
              "status": "'UNCHANGED' or 'CREATED' or 'UPDATED' or 'DELETED'"
            }
          ]
        }
        ]
        end oCMWL --------------------------------------------------------------------------------*/

var oCMTemp;

var oCMSavedOrders;
/*----------------------------------------------------------------------------------------
        [
            {
              "orderType": "MARKET",
              "session": "NORMAL",
              "duration": "DAY",
              "orderStrategyType": "SINGLE",
              "orderLegCollection": [
                {
                  "instruction": "Buy",
                  "quantity": 15,
                  "instrument": {
                    "symbol": "XYZ",
                    "assetType": "EQUITY"
                  }
                }
              ]
            }

            {
              "complexOrderStrategyType": "NONE",
              "orderType": "MARKET",
              "session": "NORMAL",
              "duration": "DAY",
              "orderStrategyType": "SINGLE",
              "orderLegCollection": [
                {
                  "instruction": "SELL",
                  "quantity": 10,
                  "instrument": {
                    "symbol": "XYZ",
                    "assetType": "EQUITY"
                  }
                }
              ]
            }


            {
            "session": "SEAMLESS",  //'NORMAL' or 'AM' or 'PM' or 'SEAMLESS'",
            "duration": "GOOD_TILL_CANCEL", //'DAY' or 'GOOD_TILL_CANCEL' 
            "orderType": "LIMIT", //"'MARKET' or 'LIMIT' or 'TRAILING_STOP' 
            "cancelTime": "2021-05-28",
            "complexOrderStrategyType": "NONE",
            "price": 45,
            "orderLegCollection": [
                {
                "orderLegType": "EQUITY",
                "legId": 1,
                "instrument": {
                    "assetType": "EQUITY",
                    "symbol": "CMBM"
                },
                "instruction": "SELL",
                "quantity": 100
                }
            ],
            "orderStrategyType": "SINGLE",
            "cancelable": true,
            "editable": true,
            "savedOrderId": 16623767,
            "savedTime": "2021-01-28T06:18:20+0000"
            }

            {
            "session": "NORMAL",
            "duration": "GOOD_TILL_CANCEL",
            "orderType": "TRAILING_STOP",
            "cancelTime": "2021-05-26",
            "complexOrderStrategyType": "NONE",
            "stopPriceLinkBasis": "MARK",
            "stopPriceLinkType": "PERCENT",
            "stopPriceOffset": 30,
            "stopType": "MARK",
            "orderLegCollection": [
                {
                "instrument": {
                    "assetType": "EQUITY",
                    "symbol": "JNUG"
                },
                "instruction": "SELL",
                "quantity": 2
                }
            ],
            "orderStrategyType": "SINGLE"
            }

        ]
        end oCMSavedOrders --------------------------------------------------------------------------------*/

//--------------------------------------------------------------------------


var DateDiff =
{
    inDays: function (d1, d2) {
        let t2 = d2.getTime();
        let t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        let t2 = d2.getTime();
        let t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        let d1Y = d1.getFullYear();
        let d2Y = d2.getFullYear();
        let d1M = d1.getMonth();
        let d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}

//var dString = "May, 20, 1984";

//var d1 = new Date(dString);
//var d2 = new Date();

//document.write("<br />Number of <b>days</b> since "+dString+": "+DateDiff.inDays(d1, d2));
//document.write("<br />Number of <b>weeks</b> since "+dString+": "+DateDiff.inWeeks(d1, d2));
//document.write("<br />Number of <b>months</b> since "+dString+": "+DateDiff.inMonths(d1, d2));
//document.write("<br />Number of <b>years</b> since "+dString+": "+DateDiff.inYears(d1

function AttemptOpen(xhttp, sWhereTo, bAsync) {
    let bOK = false;
    try {
        xhttp.open("POST", sWhereTo, bAsync);
        bOK = true;
    }
    catch (e) {
    }
    return (bOK);
}

function AttemptOpenDelete(xhttp, sWhereTo, bAsync) {
    let bOK = false;
    try {
        xhttp.open("DELETE", sWhereTo, bAsync);
        bOK = true;
    }
    catch (e) {
    }
    return (bOK);
}

function AttemptOpenGet(xhttp, sWhereTo, bAsync) {
    let bOK = false;
    try {
        xhttp.open("GET", sWhereTo, bAsync);
        bOK = true;
    }
    catch (e) {
    }
    return (bOK);
}

function AttemptOpenPatch(xhttp, sWhereTo, bAsync) {
    let bOK = false;
    try {
        xhttp.open("PATCH", sWhereTo, bAsync);
        bOK = true;
    }
    catch (e) {
    }
    return (bOK);
}

function BuildStartEndDates(sStartDate, sEndDate) {
    //sStartDate - yyyy-mm-dd, sEndDate - yyyy-mm-dd
    let bEndDateIsCurrentDate = false;
    //build start and end date sets - max of 1 year per set
    let vTmp = sStartDate.split("-");
    let sTmp = vTmp[1] + "/" + vTmp[2] + "/" + vTmp[0];
    let dStartDate = new Date(sTmp);
    vTmp = sEndDate.split("-");
    sTmp = vTmp[1] + "/" + vTmp[2] + "/" + vTmp[0];
    let dEndDate = new Date(sTmp);
    let dCurrentDate = new Date();

    let iMonthRange = 3;

    if (DateDiff.inDays(dEndDate, dCurrentDate) == 0) {
        bEndDateIsCurrentDate = true;
    }

    gsStartDates.length = 0;
    gsEndDates.length = 0;

    if (DateDiff.inMonths(dStartDate, dEndDate) >= iMonthRange) {
        let bDone = false;
        let dTmpEndDate = new Date(dStartDate);
        dTmpEndDate.setMonth(dTmpEndDate.getMonth() + iMonthRange);
        dTmpEndDate.setDate(dTmpEndDate.getDate() - 1);
        gsStartDates[gsStartDates.length] = FormatDateForTD(dStartDate);
        gsEndDates[gsEndDates.length] = FormatDateForTD(dTmpEndDate);
        while (!bDone) {
            dStartDate = new Date(dTmpEndDate);
            dStartDate.setDate(dStartDate.getDate() + 1);
            if (DateDiff.inMonths(dStartDate, dEndDate) >= iMonthRange) {
                dTmpEndDate = new Date(dStartDate);
                dTmpEndDate.setMonth(dTmpEndDate.getMonth() + iMonthRange);
                dTmpEndDate.setDate(dTmpEndDate.getDate() - 1);
                gsStartDates[gsStartDates.length] = FormatDateForTD(dStartDate);
                gsEndDates[gsEndDates.length] = FormatDateForTD(dTmpEndDate);
            } else {
                gsStartDates[gsStartDates.length] = FormatDateForTD(dStartDate);
                gsEndDates[gsEndDates.length] = FormatDateForTD(dEndDate);
                bDone = true;
            }
        }
    } else {
        gsStartDates[gsStartDates.length] = sStartDate;
        gsEndDates[gsEndDates.length] = sEndDate;
    }
    //if (DateDiff.inYears(dStartDate, dEndDate) > 0) {
    //    let bDone = false;
    //    vTmp = sStartDate.split("-");
    //    gsStartDates[gsStartDates.length] = sStartDate;
    //    gsEndDates[gsEndDates.length] = vTmp[0] + "-12-31";
    //    let iCurYear = parseInt(vTmp[0]) + 1;
    //    while (!bDone) {
    //        sTmp = "01/01/" + iCurYear.toString();
    //        let dStartDate = new Date(sTmp);
    //        if (DateDiff.inYears(dStartDate, dEndDate) > 0) {
    //            gsStartDates[gsStartDates.length] = iCurYear.toString() + "-01-01";
    //            gsEndDates[gsEndDates.length] = iCurYear.toString() + "-12-31";
    //            iCurYear++;
    //        } else {
    //            gsStartDates[gsStartDates.length] = iCurYear.toString() + "-01-01";
    //            gsEndDates[gsEndDates.length] = sEndDate;
    //            bDone = true;
    //        }
    //    }
    //} else {
    //    gsStartDates[gsStartDates.length] = sStartDate;
    //    gsEndDates[gsEndDates.length] = sEndDate;
    //}
    return bEndDateIsCurrentDate;
}

function CancelKeyStroke(ev) {
    try {
        ev.keyCode = 0;
        ev.preventDefault();
        ev.cancelBubble = true;
        ev.returnValue = false;
        return (true);
    }
    catch (e) {
        return (false)
    }
}

function CheckHTTPOpen(xhttp, sWhereTo, sErrorMsg, bAsync) {
    let bDone = false;
    let iTryCount = 0;
    let bReturnVal = false;
    while (!bDone) {
        if (!AttemptOpen(xhttp, sWhereTo, bAsync)) {
            if (iTryCount < 5) {
                iTryCount = iTryCount + 1;
            }
            else {
                alert(sErrorMsg);
                bDone = true;
            }
        }
        else {
            bDone = true;
            bReturnVal = true;
        }
    }
    return (bReturnVal);
}

function CheckHTTPOpenDelete(xhttp, sWhereTo, sErrorMsg, bAsync) {
    let bDone = false;
    let iTryCount = 0;
    let bReturnVal = false;
    while (!bDone) {
        if (!AttemptOpenDelete(xhttp, sWhereTo, bAsync)) {
            if (iTryCount < 5) {
                iTryCount = iTryCount + 1;
            }
            else {
                alert(sErrorMsg);
                bDone = true;
            }
        }
        else {
            bDone = true;
            bReturnVal = true;
        }
    }
    return (bReturnVal);
}

function CheckHTTPOpenGet(xhttp, sWhereTo, sErrorMsg, bAsync) {
    let bDone = false;
    let iTryCount = 0;
    let bReturnVal = false;
    while (!bDone) {
        if (!AttemptOpenGet(xhttp, sWhereTo, bAsync)) {
            if (iTryCount < 5) {
                iTryCount = iTryCount + 1;
            }
            else {
                alert(sErrorMsg);
                bDone = true;
            }
        }
        else {
            bDone = true;
            bReturnVal = true;
        }
    }
    return (bReturnVal);
}

function CheckHTTPOpenPatch(xhttp, sWhereTo, sErrorMsg, bAsync) {
    let bDone = false;
    let iTryCount = 0;
    let bReturnVal = false;
    while (!bDone) {
        if (!AttemptOpenPatch(xhttp, sWhereTo, bAsync)) {
            if (iTryCount < 5) {
                iTryCount = iTryCount + 1;
            }
            else {
                alert(sErrorMsg);
                bDone = true;
            }
        }
        else {
            bDone = true;
            bReturnVal = true;
        }
    }
    return (bReturnVal);
}

function checkTDAPIError(oCM) {
    //returns:
    //  0 - no error
    //  1 - access token expired
    //  2 - some other error occurred
    let iReturn = 0;
    if (oCM["error"] != null) {
        if (oCM.error == "The access token being passed has expired or is invalid.") {
            iReturn = 1;
        } else {
            iReturn = 2;
        }
        showTDAPIError(oCM.error);
    }
    return iReturn;
}

function checkTDAPIErrorNoErrorDisplayed(oCM) {
    //returns:
    //  0 - no error
    //  1 - access token expired
    //  2 - some other error occurred
    let iReturn = 0;
    if (oCM["error"] != null) {
        if (oCM.error == "The access token being passed has expired or is invalid.") {
            iReturn = 1;
        } else {
            iReturn = 2;
        }
    }
    return iReturn;
}

function chkIndexChanged(ev) {
    if (ev.currentTarget.id == "chkIndexOther") {
        if (document.getElementById("chkIndexOther").checked) {
            document.getElementById("spanIndexes").style.display = "block";
        } else {
            document.getElementById("spanIndexes").style.display = "none";
        }
        MoveDivs(document.getElementById("chkIndexOther").checked);
    }
}

function ClearAllWLInputFields(idxWL) {
    let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;
    document.getElementById("txtbuypercent" + sThisId).value = "";
    document.getElementById("txtbuydollars" + sThisId).value = "";
    //        document.getElementById("optbuyexisting" + sThisId).checked = true;
    document.getElementById("txtsellpercent" + sThisId).value = "";
    document.getElementById("chksellLimit" + sThisId).checked = false;
    document.getElementById("chkbuyLimit" + sThisId).checked = false;
    document.getElementById("txttrailingstoppercent" + sThisId).value = "";
    if (!(document.getElementById("txtwlopen" + sThisId) == null)) {
        document.getElementById("txtwlopen" + sThisId).value = "";
        document.getElementById("txtwlclose" + sThisId).value = "";
    }
}

function CollectDetailChanged(ev) {
    if (ev.srcElement.checked) {
        gbCollectDetail = true;
    } else {
        gbCollectDetail = false;
    }
}


function DeleteSavedOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gOrdersToDelete.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder < gOrdersToDelete.length; idxOrder++) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDSavedOrder();
        oTDOrder = gOrdersToDelete[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.savedOrderId;
            if (PostSODelete(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gOrdersToDelete[idxOrder].bProcessed = true;
                if (gOrdersToDelete[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gOrdersToDelete[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("DeleteSavedOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gOrdersToDelete[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gOrdersToDelete[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("DeleteSavedOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder + 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " saved  ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders deleted";
    } else {
        sMsg = sMsg + "order deleted";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("DeleteSavedOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", 0, '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gOrdersToDelete.length; idxOrder++) {
                if (!gOrdersToDelete[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gOrdersToDelete[idxOrder].sError;
                }
            }
            alert(sMsg);
        } else {
            alert(sMsg);
        }
    }

    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

//function DeleteSavedOrders1(accountId, SOIDs) {
//    let iTryCount = 0;
//    let vTmp = null;
//    let sTmp = "";
//    let bOk = true;
//    let sServerUrlBase = "https://api.tdameritrade.com/v1/accounts/xxxxxx/savedorders/";
//    while (iTryCount < 2) {
//        let sServerUrl = "";
//        sServerUrl = sServerUrlBase.replace("xxxxxx", accountId);
//        sServerUrl = sServerUrl + SOIDs;

//        let xhttp = null;
//        let iInnerTryCount = 0;
//        xhttp = oHTTP();
//        while ((xhttp == null) && (iInnerTryCount < 5)) {
//            xhttp = oHTTP();
//            iInnerTryCount = iInnerTryCount + 1;
//        }
//        iInnerTryCount = 0;
//        if (CheckHTTPOpenDelete(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
//            // set the request header
//            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

//            // send the request
//            try {
//                xhttp.send();
//                if (xhttp.responseText != null) {
//                    if (xhttp.responseText != "") {
//                        oCMTemp = myJSON.parse(xhttp.responseText);
//                        iCheckTDAPIReturn = checkTDAPIError(oCMTemp);
//                        if (iCheckTDAPIReturn != 0) {
//                            if (!(isUndefined(oCMTemp.error))) {
//                                sAPIError = oCMTemp.error;
//                            }
//                        }
//                        switch (iCheckTDAPIReturn) {
//                            case 0: //no error
//                                {
//                                    iReturn = 0;
//                                    gsLastError = "";
//                                    iTryCount = 2;
//                                    break;
//                                }
//                            case 1: //acces code expired
//                                {
//                                    xhttp = null;
//                                    if (GetAccessCodeUsingRefreshToken()) {
//                                        iTryCount++;
//                                    } else {
//                                        gsLastError = "Access code expired. Refresh failed."
//                                        bOk = false;
//                                        iTryCount = 2;
//                                    }
//                                    break;
//                                }
//                            case 2: //other error
//                                {
//                                    if (sAPIError.toUpperCase() == "BAD REQUEST.") {
//                                        gsLastError = "Invalid search arguments.";
//                                    } else {
//                                        gsLastError = sAPIError;
//                                    }
//                                    bOk = false;
//                                    iTryCount = 2;
//                                    break;
//                                }
//                            default:
//                                {
//                                    iReturn = 3;
//                                    gsLastError = "Unknown error.";
//                                    iTryCount = 2;
//                                    bOk = false;
//                                    break;
//                                }
//                        }
//                    } else {
//                        if (xhttp.status != 200) {
//                            gsLastError = "HTTP status is " + xhttp.status + ".";
//                            bOk = false;
//                        }
//                        iTryCount = 2;
//                    }
//                } else {
//                    if (xhttp.status != 200) {
//                        gsLastError = "HTTP status is " + xhttp.status + ".";
//                        bOk = false;
//                    }
//                    iTryCount = 2;
//                }
//            }
//            catch (e1) {
//                //debugger
//                iTryCount++;
//                if (iTryCount < 2) {
//                    xhttp = null;
//                }
//                else {
//                    alert("DeleSavedOrders Error deleting orders (" + iTryCount.toString() + ") - " + e1.message);
//                    bOk = false;
//                }
//            }
//        }
//        else {
//            break;
//        }
//    }

//    let sMsg = SOIDs.split(",").length + " Saved Orders ";

//    if (bOk) {
//        sMsg = sMsg + "deleted";
//    } else {
//        sMsg = sMsg + "failed -- " + gsLastError;
//    }
//    alert(sMsg);

//    gbDoingCreateOrders = false;
//    SetDefault();

//}

function DoChangeIndexChange() {
    gbMarketShowChangePercentage = !gbMarketShowChangePercentage;
    for (let idxIndex = 0; idxIndex < gMarketIndexes.length; idxIndex++) {
        if (gbMarketShowChangePercentage) {
            if (gMarketIndexes[idxIndex].netPercentChangeInDouble < 0.0) {
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = FormatDecimalNumber(gMarketIndexes[idxIndex].netPercentChangeInDouble, 5, 2, "") + "%";
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = gsNegativeColor;
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
            } else {
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = "+" + FormatDecimalNumber(gMarketIndexes[idxIndex].netPercentChangeInDouble, 5, 2, "") + "%";
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = "green";
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
            }
        } else {
            if (gMarketIndexes[idxIndex].netChange < 0.0) {
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = FormatMoney(gMarketIndexes[idxIndex].netChange);
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = gsNegativeColor;
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
            } else {
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = "+" + FormatMoney(gMarketIndexes[idxIndex].netChange);
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = "green";
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
            }
        }
    }
}

function DoGetIndexValues() {
    DoGetTDData();
    //        window.setTimeout("GetIndexValues()", 50);
}

function DoGetStockPriceHistory() {

    if (document.pwdForm.btnGetStockPriceHistory.value == "Stop Price History") {
        gbDoingStockPriceHistory = false;
        document.pwdForm.btnGetStockPriceHistory.style.cursor = "wait";
        document.pwdForm.btnGetStockPriceHistory.disabled = true;
    } else {
        if (!IsMarketOpen()) {
            if (!gbUseLastTradingDay) {
                alert("The market is currently closed. Click on Use last trading day.");
                return;
            }
        }

        gbDoingStockPriceHistory = true;
        document.pwdForm.btnGetStockPriceHistory.value == "Stop Price History";
        //debugger
        document.getElementById("miscname").innerHTML = "";
        document.getElementById("mischead").innerHTML = "";
        document.getElementById("misc").innerHTML = "";
        document.getElementById("name").innerHTML = "";
        document.getElementById("nameTitle").innerHTML = "&nbsp;";
        SetWait();
        window.setTimeout("GetStockPriceHistory()", 50);
    }
}

function DoGetTDData() {
    if (giGetTDDataTimeoutId != 0) {
        window.clearTimeout(giGetTDDataTimeoutId);
        giGetTDDataTimeoutId = 0;
        if (!gbDoingGetTDData) {
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 30);
        } else {
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 1000);
        }
    } else {
        giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 30);
    }
}

function DoGetTrades() {

    if (gbDoingGetTrades) {
        gbStopGetTrades = true;
    } else {
        document.pwdForm.btnGetTrades.value = "Stop";
        let iMarketOpen = IsMarketOpen();
        if (iMarketOpen == 2) {
            if (GetAccessCodeUsingRefreshToken()) {
                iMarketOpen = IsMarketOpen();
                if (iMarketOpen == 2) {
                    alert("An error occurred attempting to refresh the access code. Please reload the app.");
                    GetTradesCanceled();
                    return;
                }
            } else {
                alert("An error occurred attempting to refresh the access code. Please reload the app.");
                GetTradesCanceled();
                return;
            }
        }
        //debugger
        document.getElementById("tblDetail").style.visibility = "hidden";
        document.getElementById("miscname").innerHTML = "";
        document.getElementById("mischead").innerHTML = "";
        document.getElementById("misc").innerHTML = "";
        document.getElementById("name").innerHTML = "";
        document.getElementById("nameTitle").innerHTML = "&nbsp;";
        gbDoingGetTrades = true;
        SetWait();
        window.setTimeout("GetTrades(true)", 50);
    }
}

function DoGetTradesBySymbol(sSymbolToLookup, sAccountID, sAccountName, sTRId, idxSymbol) {
    document.getElementById("tblDetail").style.visibility = "visible";
    document.getElementById("miscname").innerHTML = "";
    document.getElementById("mischead").innerHTML = "";
    document.getElementById("misc").innerHTML = "";
    window.setTimeout("GetTradesBySymbol('" + sSymbolToLookup + "','" + sAccountID + "','" + sAccountName + "','" + sTRId + "', " + idxSymbol.toString() + ")", 50);
}

function DoHideDiv(sDiv) {
    try {
        if (!gbDoingStockPriceHistory) {
            document.getElementById(sDiv).style.visibility = "hidden";
        }
    } catch (e) {

    }
}

function DoGetWatchlistPrices() {
    window.setTimeout("GetWatchlistPrices()", 50);
}

function DoResetWatchlists() {
    gbDoResetWatchlists = true;
    DoGetTDData();
}

function DoShowPriceHistory(idxPriceInfo, idxPriceHistory) {
    if (!gbGettingStockPriceHistory) {
        DoShowPriceHistoryDetail(idxPriceInfo, idxPriceHistory, true);
    }
}

function DoShowPriceHistoryDetail(idxPriceInfo, idxPriceHistory, bClicked) {
    let sTextAlignHeader = "center";
    let s = "";
    if ((document.getElementById("tblDetail").style.visibility == "visible")
        && (bClicked)
        && ((document.getElementById("miscname").innerHTML).indexOf(gPriceInfo[idxPriceInfo].symbol) != -1)) {
        document.getElementById("miscname").innerHTML = "";
        document.getElementById("tblDetail").style.visibility = "hidden";
    } else {
        s = "<table style=\"width:100%;border-width:0px;\">";
        s = s + gPriceMinutes[idxPriceHistory] + "</table>";
        document.getElementById("misc").innerHTML = s;

        s = "<table style=\"border-width:0px; border-style:solid;border-spacing:0px;border-color:White;width:100%\"><tr><th style=\"height:18px;border-width:1px;border-style:solid;border-spacing:1px;border-color:White;\">";
        s = s + gPriceInfo[idxPriceInfo].symbol;
        s = s + "</th></tr></table>";
        document.getElementById("miscname").innerHTML = s;

        s = "<table style=\"width:100%;border-width:0px;\">";
        s = s + "<tr>";
        s = s + "<th style=\"width:20%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>Date</I></th>";
        s = s + "<th style=\"width:16%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>High</I></th>";
        s = s + "<th style=\"width:16%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>Low&nbsp;&nbsp;&nbsp;&nbsp;</I></th>";
        s = s + "<th style=\"width:16%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>Vol&nbsp;&nbsp;&nbsp;&nbsp;</I></th>";
        s = s + "<th style=\"width:16%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>Open&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</I></th>";
        s = s + "<th style=\"width:16%; text-align:" + sTextAlignHeader + ";vertical-align:top;border-width:0px;\"><I>Close&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</I></th>";
        s = s + "</tr></table>";
        document.getElementById("mischead").innerHTML = s;


        let iPwdFormHeight = document.getElementById("pwdForm").clientHeight + 10;
        document.getElementById("tblDetail").style.width = "800px";
        document.getElementById("detailTitle").style.width = "780px";
        document.getElementById("tblDetail").style.left = "0px";
        document.getElementById("tblDetail").style.top = (document.getElementById("tblSymbols").clientHeight + iPwdFormHeight).toString() + "px";
        document.getElementById("tblDetail").style.visibility = "visible";
    }
}

function DoSODeleteOrders(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {

        let sAccountId = gWatchlists[idxWL].accountId;
        let iNumSelected = 0;

        gOrdersToDelete.length = 0;

        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) {
                iNumSelected++;
                let oWLItem = new WLItemSavedOrder();
                oWLItem = gWatchlists[idxWL].WLItems[idxWLItem];
                let oTDSavedOrder = new TDSavedOrder();
                oTDSavedOrder.savedOrderId = oWLItem.savedOrderId;
                let d = new Date(oWLItem.savedTime.split("+")[0] + "+00:00");
                oTDSavedOrder.symbol = oWLItem.symbol + " -- " + FormatTDTradeDate(d);
                gOrdersToDelete[gOrdersToDelete.length] = oTDSavedOrder;
            }
        }
        if (iNumSelected == 0) {
            alert("Please select at least one saved order to delete.")
            return;
        }
        let sConfirmMsg = "";
        sConfirmMsg = "Deleting  " + iNumSelected.toString() + " saved orders. ";
        if (AreYouSure(sConfirmMsg)) {
            gbDoingCreateOrders = true;
            SetWait();
            window.setTimeout("DeleteSavedOrders(true, 0, 0, 0, 0, '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
        }

        return;
    }
}

function DoURLEncode(sData) {
    let sReturn = "";
    if (sData.length > 0) {
        sReturn = encodeURIComponent(sData);
    }
    return sReturn;
}

function DoWLBuy(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {
        let sSelectNum = "";
        let iSelectNum = 0;
        let dSelectNum = 0.0;
        let bDoingLimit = false;

        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sPercent = TrimLikeVB(document.getElementById("txtbuypercent" + sThisId).value);
        let sDollars = TrimLikeVB(document.getElementById("txtbuydollars" + sThisId).value);

        //let bExisting = document.getElementById("optbuyexisting" + sThisId).checked;
        let bExisting = false;

        if ((sPercent == "") && (sDollars == "")) {
            alert("Missing a Buy percentage value OR a Buy dollar amount.");
            return;
        }
        if ((sPercent != "") && (sDollars != "")) {
            alert("Please enter a Buy percentage value OR a Buy dollar amount.");
            return;
        }
        if (sPercent != "") {
            //using percent
            try {
                iSelectNum = parseInt(sPercent);
                if (iSelectNum < 1) {
                    alert("Invalid Buy percentage. Must be greater than or equal to 1.");
                    return;
                } else {
                    sSelectNum = iSelectNum.toString();
                }
            } catch (e) {
                alert("Please enter a Buy percentage between greater than or equal to 1.");
                return;
            }
        } else {
            //using dollar amount
            dSelectNum = parseFloat(sDollars);
            if (isNaN(dSelectNum)) {
                alert("Invalid Buy dollar amount.");
                return;
            }
            if (dSelectNum < 0) {
                alert("Invalid Buy dollar amount. Must be greater than 0.");
                return;
            } else {
                sSelectNum = FormatDecimalNumber(dSelectNum, 5, 2, "");
                dSelectNum = parseFloat(sSelectNum);
            }
        }

        let sConfirmMsg = "";

        if (document.getElementById("chkbuyLimit" + sThisId).checked) {
            bDoingLimit = true;
        }

        //if (!gbRegularMarketHours) {
        //    if (document.getElementById("chkbuyLimit" + sThisId).checked) {
        //        bDoingLimit = true;
        //    }
        //}
        if (bDoingLimit) {
            if (iSelectNum != 0) {
                sConfirmMsg = "LIMIT orders to BUY " + sSelectNum + "% of selected symbols. ";
            } else {
                sConfirmMsg = "LIMIT orders to BUY $" + sSelectNum + " worth of selected symbols. ";
            }
            if (AreYouSure(sConfirmMsg)) {
                window.setTimeout("GenerateWLBuyOrdersLimit('" + sAccountId + "', " + iSelectNum + ", " + dSelectNum + ", " + idxWL + ", " + bExisting + ")", 10);
            }
        } else {
            if (iSelectNum != 0) {
                sConfirmMsg = "BUY " + sSelectNum + "% of selected symbols. ";
            } else {
                sConfirmMsg = "BUY $" + sSelectNum + " worth of selected symbols. ";
            }
            if (AreYouSure(sConfirmMsg)) {
                window.setTimeout("GenerateWLBuyOrders('" + sAccountId + "', " + iSelectNum + ", " + dSelectNum + ", " + idxWL + ", " + bExisting + ")", 10);
            }
        }
        return;
    }
}

function DoWLCloseSymbol(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {
        let sSelectNum = "";
        let dSelectNum = 0.0;
        let sSymbol = "";

        if (gWatchlists[idxWL].watchlistId == gWatchlists[idxWL].accountId) {
            alert("Cannot Update G/L or Add symbols in an Account watchlist.");
            return;
        }

        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sDollars = TrimLikeVB(document.getElementById("txtwlclose" + sThisId).value);
        if (sDollars == "") {
            dSelectNum = 0;
        } else {
            dSelectNum = parseFloat(sDollars);
            if (isNaN(dSelectNum)) {
                dSelectNum = 0;
            }
        }

        sSelectNum = FormatDecimalNumber(dSelectNum, 5, 2, "");
        dSelectNum = parseFloat(sSelectNum);

        let iNumSelected = 0;
        let bHasShares = false;
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) {
                iNumSelected++;
                if (iNumSelected > 1) {
                    break;
                }
                sSymbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
            }
        }
        if (iNumSelected > 1) {
            alert("Please select only 1 symbol.")
        } else if (iNumSelected == 0) {
            alert("Please select a symbol.")
        } else {
            let sConfirmMsg = "";
            sConfirmMsg = "Update " + sSymbol + " with Gain/Loss $" + sSelectNum + ". ";
            if (AreYouSure(sConfirmMsg)) {
                window.setTimeout("GenerateWLCloseSymbolOrders('" + sAccountId + "', " + dSelectNum + ", " + idxWL + ", '" + sSymbol + "')", 10);
            }
            ////now check to see if the selected symbol has any shares
            //if (gAccounts.length > 0) {
            //    for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
            //        if (gAccounts[idxAccounts].accountId == sAccountId) {
            //            let oAccount = new Account();
            //            oAccount = gAccounts[idxAccounts];
            //            if (oAccount.positions.length > 0) {
            //                for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
            //                    let oPosition = new Position();
            //                    oPosition = oAccount.positions[idxPosition];
            //                    if (oPosition.assetType == "EQUITY") {
            //                        if (oPosition.symbol == sSymbol) {
            //                            if (oPosition.longQuantity > 0) {
            //                                bHasShares = true;
            //                            }
            //                            break;
            //                        }
            //                    }
            //                }
            //            }
            //            break;
            //        }
            //    }
            //}
            //if (bHasShares) {
            //    alert("Selected symbol has shares. Cannot close.");
            //} else {
            //    let sConfirmMsg = "";
            //    sConfirmMsg = "Close " + sSymbol + " with Gain/Loss $" + sSelectNum + ". ";
            //    if (AreYouSure(sConfirmMsg)) {
            //        window.setTimeout("GenerateWLCloseSymbolOrders('" + sAccountId + "', " + dSelectNum + ", " + idxWL + ", '" + sSymbol + "')", 10);
            //    }
            //}
        }

        return;
    }
}

function DoWLDeleteSymbols(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {

        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sSymbolsToLookup = "";
        let sSequenceIds = "";
        let sSymbolsToLookupSep = "";

        let iNumSelected = 0;
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) {
                iNumSelected++;
                sSymbolsToLookup = sSymbolsToLookup + sSymbolsToLookupSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                sSequenceIds = sSequenceIds + sSymbolsToLookupSep + gWatchlists[idxWL].WLItems[idxWLItem].sequenceId.toString();
                sSymbolsToLookupSep = ", ";
            }
        }
        if (iNumSelected == 0) {
            alert("Please select at least one symbol to delete.")
            return;
        }

        if (iNumSelected == gWatchlists[idxWL].WLItems.length) {
            alert("Cannot select all symbols to delete. Leave at least one symbol unselected.")
            return;
        }

        let sConfirmMsg = "";
        sConfirmMsg = "Deleting symbols " + sSymbolsToLookup.toUpperCase() + ". ";
        if (AreYouSure(sConfirmMsg)) {
            window.setTimeout("GenerateWLDeleteSymbolOrders('" + sAccountId + "', " + idxWL + ", '" + sSequenceIds + "')", 10);
        }
        return;
    }
}

function DoWLOpenSymbols(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {

        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sSymbolsToLookup = "";
        let sSymbolsToLookupSep = "";
        let sSymbolsToLookupTmp = TrimLikeVB(document.getElementById("txtwlopen" + sThisId).value);
        let sSymbolsAlreadyOpen = "";
        let sSymbolsAlreadyOpenSep = "";

        let sAcquiredDate = TrimLikeVB(document.getElementById("txtwlacquired" + sThisId).value);
        if (sAcquiredDate != "") {
            if (!ValidateTDDate(sAcquiredDate)) {
                alert("Please enter an acquired date as yyyy-mm-dd.");
                return;
            }
        }

        if (sSymbolsToLookupTmp == "") {
            //alert("Please enter at least 1 symbol.");
            let iNumSelected = 0;
            let bHasShares = false;
            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                if (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) {
                    iNumSelected++;
                    sSymbolsToLookup = sSymbolsToLookup + sSymbolsToLookupSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                    sSymbolsToLookupSep = ", ";
                }
            }
            if (sAcquiredDate == "") {
                if (iNumSelected == 0) {
                    alert("Please select at least one symbol to clear the Acquired date.")
                    return;
                }
                if (iNumSelected == gWatchlists[idxWL].WLItems.length) {
                    alert("Cannot select all symbols to clear the Acquired Date. Leave at least one symbol unselected.")
                    return;
                }
                let sConfirmMsg = "";
                sConfirmMsg = "Clearing the Acquired Date for " + sSymbolsToLookup.toUpperCase() + ". ";
                if (AreYouSure(sConfirmMsg)) {
                    window.setTimeout("GenerateWLOpenSymbolOrders('" + sAccountId + "', " + idxWL + ", '','" + sAcquiredDate + "')", 10);
                }
            } else {
                if (iNumSelected == 0) {
                    alert("Please select at least one symbol to change the Acquired date.")
                    return;
                }
                let sConfirmMsg = "";
                sConfirmMsg = "Changing the Acquired Date for " + sSymbolsToLookup.toUpperCase() + ". ";
                if (AreYouSure(sConfirmMsg)) {
                    window.setTimeout("GenerateWLOpenSymbolOrders('" + sAccountId + "', " + idxWL + ", '','" + sAcquiredDate + "')", 10);
                }
            }
        } else {
            sSymbolsToLookupTmp = GetUniqueListOfSymbols(sSymbolsToLookupTmp);
            let vTmp = sSymbolsToLookupTmp.split(",");
            if (vTmp.length > 0) {
                let iNumAlreadyOpened = 0;
                sSymbolsToLookup = "";
                //check to see if already in watchlist
                let bFound = false;
                for (let idxvTmp = 0; idxvTmp < vTmp.length; idxvTmp++) {
                    bFound = false;
                    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                        if (vTmp[idxvTmp] == gWatchlists[idxWL].WLItems[idxWLItem].symbol) {
                            bFound = true;
                            sSymbolsAlreadyOpen = sSymbolsAlreadyOpen + sSymbolsAlreadyOpenSep + vTmp[idxvTmp];
                            sSymbolsAlreadyOpenSep = ", ";
                            iNumAlreadyOpened++;
                            break;
                        }
                    }
                    if (!bFound) {
                        sSymbolsToLookup = sSymbolsToLookup + sSymbolsToLookupSep + vTmp[idxvTmp];
                        sSymbolsToLookupSep = ",";
                    }
                }
                let sConfirmMsg = "";
                if (sSymbolsAlreadyOpen != "") {
                    if (iNumAlreadyOpened == 1) {
                        sConfirmMsg = sSymbolsAlreadyOpen + " already exists."
                    } else {
                        sConfirmMsg = sSymbolsAlreadyOpen + " already exist."
                    }
                }
                if (sSymbolsToLookup != "") {
                    if (sConfirmMsg != "") {
                        sConfirmMsg = sConfirmMsg + gsCRLF + "Adding " + sSymbolsToLookup.toUpperCase() + ". ";
                    } else {
                        sConfirmMsg = "Adding " + sSymbolsToLookup.toUpperCase() + ". ";
                    }
                    if (AreYouSure(sConfirmMsg)) {
                        window.setTimeout("GenerateWLOpenSymbolOrders('" + sAccountId + "', " + idxWL + ", '" + sSymbolsToLookup.toUpperCase() + "','" + sAcquiredDate + "')", 10);
                    }
                } else {
                    if (sConfirmMsg != "") {
                        sConfirmMsg = sConfirmMsg + gsCRLF + "No symbols will be added.";
                    } else {
                        sConfirmMsg = "No symbols will be added.";
                    }
                    alert(sConfirmMsg);
                }
            } else {
                alert("Please enter at least 1 symbol.");
            }
        }

        return;
    }
}

function DoWLSell(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {
        let sSelectNum = "";
        let iSelectNum = 0;
        let bDoingLimit = false;
        //debugger
        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sSymbolsThisWL = "";
        let sSep = "";
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                sSep = ",";
            }
        }
        sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";

        sSelectNum = document.getElementById("txtsellpercent" + sThisId).value;
        sTmp = TrimLikeVB(sSelectNum);
        if (sTmp == "") {
            alert("Please enter a Sell percentage from 1 to 100.");
            return;
        }
        try {
            iSelectNum = parseInt(sSelectNum);
            if ((iSelectNum < 1) || (iSelectNum > 100)) {
                alert("Invalid Sell percentage. Must be from 1 to 100.");
                return;
            }
            else {
                if (document.getElementById("chksellLimit" + sThisId).checked) {
                    bDoingLimit = true;
                }
                //if (!gbRegularMarketHours) {
                //    if (document.getElementById("chksellLimit" + sThisId).checked) {
                //        bDoingLimit = true;
                //    }
                //}
                if (bDoingLimit) {
                    if (AreYouSure(iSelectNum.toString() + "% LIMIT SELL orders for the selected symbols might be 1% lower than the current market price. ")) {
                        window.setTimeout("GenerateWLSellOrdersLimit('" + sAccountId + "', " + iSelectNum + ", '" + sSymbolsThisWL + "', " + idxWL.toString() + ")", 10);
                    }
                } else {
                    if (AreYouSure("SELL " + iSelectNum.toString() + "% of selected symbols. ")) {
                        window.setTimeout("GenerateWLSellOrders('" + sAccountId + "', " + iSelectNum + ", '" + sSymbolsThisWL + "', " + idxWL.toString() + ")", 10);
                    }
                }
            }
        }
        catch (e) {
            alert("Invalid Sell percentage. Must be from 1 to 100.");
            sSelectNum = "";
        }
    }
}

function DoWLTrailingStop(idxWL) {
    if (!gbDoingCreateOrders && !gbDoingGetTrades && !gbDoingGetTDData && !gbDoingStockPriceHistory) {
        let sSelectNum = "";
        let iSelectNum
        //debugger
        let sAccountId = gWatchlists[idxWL].accountId;
        let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

        let sSymbolsThisWL = "";
        let sSep = "";
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                sSep = ",";
            }
        }
        sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";

        sSelectNum = document.getElementById("txttrailingstoppercent" + sThisId).value;
        sTmp = TrimLikeVB(sSelectNum);
        if (sTmp == "") {
            alert("Please enter a Trailing Stop percentage from 1 to 100.");
            return;
        }
        try {
            iSelectNum = parseInt(sSelectNum);
            if ((iSelectNum < 1) || (iSelectNum > 100)) {
                alert("Invalid Trailing Stop percentage. Must be from 1 to 100.");
                return;
            }
            else {
                if (AreYouSure("Set TRAILING STOP at " + iSelectNum.toString() + "% for the selected symbols. ")) {
                    window.setTimeout("GenerateWLTrailingStopOrders('" + sAccountId + "', " + iSelectNum + ", '" + sSymbolsThisWL + "', " + idxWL.toString() + ")", 10);
                }
            }
        }
        catch (e) {
            alert("Invalid Trailing Stop percentage. Must be from 1 to 100.");
            sSelectNum = "";
        }
    }
}

function drag_div(div_id) {
    let div;

    div = document.getElementById(div_id);

    if (div == null) {
        return;
    }

    div.addEventListener('mousedown', function (e) {
        if (!((((div.offsetTop - window.pageYOffset) - e.clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.clientY) < -20))) {
            div.isDown = true;
            gbDoingDrag = true;
            div.offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }
    }, true);

    div.addEventListener('touchstart', function (e) {
        if (!((((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) < -20))) {
            div.isDown = true;
            gbDoingDrag = true;
            div.offset = [
                div.offsetLeft - e.touches[0].clientX,
                div.offsetTop - e.touches[0].clientY
            ];
        }
    }, true);

    div.addEventListener('mouseup', function () {
        div.isDown = false;
        gbDoingDrag = false;
    }, true);

    div.addEventListener('touchend', function () {
        div.isDown = false;
        gbDoingDrag = false;
    }, true);

    div.addEventListener('mousemove', function (event) {
        event.preventDefault();
        if (div.isDown) {
            div.mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
            div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
        }
    }, true);

    div.addEventListener('touchmove', function (event) {
        if (div.isDown) {
            event.preventDefault();
            div.mousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
            div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
        }
    }, true);

}

function drag_divPH(div_id) {
    let div;

    div = document.getElementById(div_id);

    if (div == null) {
        return;
    }

    div.addEventListener('mousedown', function (e) {
        if (!gbDoingStockPriceHistory) {
            if (!((((div.offsetTop - window.pageYOffset) - e.clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.clientY) < -20))) {
                div.isDown = true;
                gbDoingDrag = true;
                div.offset = [
                    div.offsetLeft - e.clientX,
                    div.offsetTop - e.clientY
                ];
            }
        }
    }, true);

    div.addEventListener('touchstart', function (e) {
        if (!gbDoingStockPriceHistory) {
            if (!((((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) < -20))) {
                div.isDown = true;
                gbDoingDrag = true;
                div.offset = [
                    div.offsetLeft - e.touches[0].clientX,
                    div.offsetTop - e.touches[0].clientY
                ];
            }
        }
    }, true);

    div.addEventListener('mouseup', function () {
        if (!gbDoingStockPriceHistory) {
            div.isDown = false;
            gbDoingDrag = false;
        }
    }, true);

    div.addEventListener('touchend', function () {
        if (!gbDoingStockPriceHistory) {
            div.isDown = false;
            gbDoingDrag = false;
        }
    }, true);

    div.addEventListener('mousemove', function (event) {
        if (!gbDoingStockPriceHistory) {
            event.preventDefault();
            if (div.isDown) {
                div.mousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
                div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
                div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
            }
        }
    }, true);

    div.addEventListener('touchmove', function (event) {
        if (!gbDoingStockPriceHistory) {
            if (div.isDown) {
                event.preventDefault();
                div.mousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
                div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
                div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
            }
        }
    }, true);

}

function drag_divWL(div_id) {
    let div;

    div = document.getElementById(div_id);

    if (div == null) {
        return;
    }

    div.addEventListener('mousedown', function (e) {
        if ((!((((div.offsetTop - window.pageYOffset) - e.clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.clientY) < -20))) &&
            ((e.clientX > (div.offsetLeft - window.pageXOffset) + giWLDragXoffsetLeft) && (e.clientX < (div.offsetLeft - window.pageXOffset) + giWLDragXoffsetRight))) {
            div.isDown = true;
            gbDoingDrag = true;
            div.offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }
    }, true);

    div.addEventListener('touchstart', function (e) {
        if ((!((((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) > 20) || (((div.offsetTop - window.pageYOffset) - e.touches[0].clientY) < -20)))
            ((e.touches[0].clientX > (div.offsetLeft - window.pageXOffset) + giWLDragXoffsetLeft) && (e.touches[0].clientX < (div.offsetLeft - window.pageXOffset) + giWLDragXoffsetRight))) {
            div.isDown = true;
            gbDoingDrag = true;
            div.offset = [
                div.offsetLeft - e.touches[0].clientX,
                div.offsetTop - e.touches[0].clientY
            ];
        }
    }, true);

    div.addEventListener('mouseup', function () {
        div.isDown = false;
        gbDoingDrag = false;
    }, true);

    div.addEventListener('touchend', function () {
        div.isDown = false;
        gbDoingDrag = false;
    }, true);

    div.addEventListener('mousemove', function (event) {
        event.preventDefault();
        if (div.isDown) {
            div.mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
            div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
        }
    }, true);

    div.addEventListener('touchmove', function (event) {
        if (div.isDown) {
            event.preventDefault();
            div.mousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            div.style.left = (div.mousePosition.x + div.offset[0]) + 'px';
            div.style.top = (div.mousePosition.y + div.offset[1]) + 'px';
        }
    }, true);

}

function FindSymbolsInWatchlists() {
    if (gWatchlists.length > 0) {
        let sSymbolsToLookupTmp = TrimLikeVB(document.getElementById("txtSymbols").value);
        let sAlertMsg = "";
        let sAlertSep = "";
        let sWLExclusionList = ",DEFAULT,EVERYTHING,INDEXES,ACCOUNT,"
        if (sSymbolsToLookupTmp != "") {
            sSymbolsToLookupTmp = sSymbolsToLookupTmp.toUpperCase();
            sSymbolsToLookupTmp = GetUniqueListOfSymbols(sSymbolsToLookupTmp);
            let vTmp = sSymbolsToLookupTmp.split(",");
            let idxSymLimit = 0;
            if (vTmp.length > 3) {
                idxSymLimit = 3;
            } else {
                idxSymLimit = vTmp.length;
            }
            let sSymbolsToLookup = "";
            let sSymbolsToLookupSep = "";
            for (let idxSym = 0; idxSym < idxSymLimit; idxSym++) {
                let sSep = "";
                let sWatchlists = "";
                sSymbolsToLookup = sSymbolsToLookup + sSymbolsToLookupSep + vTmp[idxSym];
                sSymbolsToLookupSep = ", ";
                for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                    if (sWLExclusionList.indexOf("," + UnReplace_XMLChar(gWatchlists[idxWL].name).toUpperCase() + ",") == -1) {
                        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                            if (vTmp[idxSym] == gWatchlists[idxWL].WLItems[idxWLItem].symbol.toUpperCase()) {
                                sWatchlists = sWatchlists + sSep + UnReplace_XMLChar(gWatchlists[idxWL].name) + " (" + gWatchlists[idxWL].accountName + ")";
                                sSep = "\n           ";
                                break;
                            }
                        }
                    }
                }
                if (sWatchlists != "") {
                    sAlertMsg = sAlertMsg + sAlertSep + vTmp[idxSym] + " -- " + sWatchlists;
                    sAlertSep = "\n\n";
                }
            }
            if (sAlertMsg != "") {
                alert(sAlertMsg);
            } else {
                alert(sSymbolsToLookup + " are not contained in any watchlist.");
            }
        }
    }
}

function FormatDateForTD(d) {
    let s = "";
    let iMonth = d.getMonth() + 1;
    let iDay = d.getDate();
    let iYear = d.getYear();

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
    return s;
}

function GenerateWLBuyOrders(sAccountId, iSelectNum, dSelectNum, idxWL, bExisting) {
    //if iSelectNum > 0 then buying a percentage of shares based on what is currently owned
    //if dSelectnum > 0 then buying dSelectNum's worth of shares for each stock in the watchlist
    //debugger
    let sSymbolsThisWL = "";
    let sSep = "";
    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
        if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
            sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
            sSep = ",";
        }
    }
    sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";
    gTDOrders.length = 0;
    if (iSelectNum > 0) {
        //buying a percentage of shares based on what is currently owned
        if (gAccounts.length > 0) {
            for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                if (gAccounts[idxAccounts].accountId == sAccountId) {
                    let oAccount = new Account();
                    oAccount = gAccounts[idxAccounts];
                    let bAddOrdersForThisAccount = false;
                    if (oAccount.positions.length > 0) {
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                    bAddOrdersForThisAccount = true;
                                    break;
                                }
                            }
                        }
                        if (bAddOrdersForThisAccount) {
                            gTDOrders.length = 0;
                            for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                                let oPosition = new Position();
                                oPosition = oAccount.positions[idxPosition];
                                if (oPosition.assetType == "EQUITY") {
                                    if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                        let oTDOrder = new TDOrder();
                                        oTDOrder.a02orderType = oTDOrder.a02orderType + "\"MARKET\", ";
                                        oTDOrder.a04duration = oTDOrder.a04duration + "\"DAY\", ";
                                        oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";

                                        let iNumToBuy = oPosition.longQuantity * (iSelectNum / 100.0);
                                        if (iNumToBuy >= 1.0) {
                                            iNumToBuy = Math.floor(iNumToBuy);
                                        } else if (iNumToBuy > 0.0) {
                                            iNumToBuy = 1;
                                        } else {
                                            iNumToBuy = 0;
                                        }
                                        if (iNumToBuy > 0) {
                                            oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                                            oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + oPosition.symbol + "\", "
                                            oTDOrder.symbol = oPosition.symbol;
                                            gTDOrders[gTDOrders.length] = oTDOrder;
                                        }
                                    }
                                }
                            }
                            //create orders here
                            if (gTDOrders.length > 0) {
                                gTDOrders.sort(sortBySymbol);
                                gbDoingCreateOrders = true;
                                SetWait();
                                window.setTimeout("PostWLBuyOrders(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
                            } else {
                                alert("No orders were generated for this watchlist.");
                            }
                        } else {
                            alert("No positions selected.");
                        }
                    } else {
                        alert("There are no positions in this watchlist.");
                    }
                    break;
                }
            }
        }
    } else {
        //then buying dSelectNum's worth of shares for each stock in the watchlist
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                let oWatchList = new WLWatchList();
                let oWatchListItem = new WLItem();
                oWatchList = gWatchlists[idxWL];
                oWatchListItem = oWatchList.WLItems[idxWLItem];
                let sSymbol = oWatchListItem.symbol;
                for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                    let oWLDisplayed = new WLDisplayed();
                    oWLDisplayed = gWLDisplayed[idxDisplayed];
                    let oWLItemDetail = new WLItemDetail();
                    if (sSymbol == oWLDisplayed.symbol) {
                        for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                            oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];

                            let oTDOrder = new TDOrder();
                            oTDOrder.a02orderType = oTDOrder.a02orderType + "\"MARKET\", ";
                            oTDOrder.a04duration = oTDOrder.a04duration + "\"DAY\", ";
                            oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";

                            let iNumToBuy = Math.floor(dSelectNum / oWLItemDetail.regularMarketLastPrice);
                            if (iNumToBuy > 0) {
                                oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                                oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                                oTDOrder.symbol = sSymbol;
                                gTDOrders[gTDOrders.length] = oTDOrder;
                            }
                            //if ((oWatchList.accountId == oWLItemDetail.accountId) || (!bExisting)) {
                            //    let oTDOrder = new TDOrder();
                            //    oTDOrder.a02orderType = oTDOrder.a02orderType + "\"MARKET\", ";
                            //    oTDOrder.a04duration = oTDOrder.a04duration + "\"DAY\", ";
                            //    oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";

                            //    let iNumToBuy = Math.floor(dSelectNum / oWLItemDetail.regularMarketLastPrice);
                            //    if (iNumToBuy > 0) {
                            //        oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                            //        oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                            //        oTDOrder.symbol = sSymbol;
                            //        gTDOrders[gTDOrders.length] = oTDOrder;
                            //    }
                            //}
                            break;
                        }
                    }
                }
            }
        }
        if (gTDOrders.length > 0) {
            gTDOrders.sort(sortBySymbol);
            gbDoingCreateOrders = true;
            SetWait();
            window.setTimeout("PostWLBuyOrders(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
        } else {
            alert("No orders were generated for this watchlist.");
        }
    }

}

function GenerateWLBuyOrdersLimit(sAccountId, iSelectNum, dSelectNum, idxWL, bExisting) {
    //if iSelectNum > 0 then buying a percentage of shares based on what is currently owned
    //if dSelectnum > 0 then buying dSelectNum's worth of shares for each stock in the watchlist
    //debugger
    let dtCancelTime = new Date(); //get todays date
    dtCancelTime.setMonth(dtCancelTime.getMonth() + 4);
    let sCancelTime = FormatDateForTD(dtCancelTime);

    let sSymbolsThisWL = "";
    let sSep = "";
    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
        if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
            sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
            sSep = ",";
        }
    }
    sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";
    gTDOrders.length = 0;
    if (iSelectNum > 0) {
        //buying a percentage of shares based on what is currently owned
        if (gAccounts.length > 0) {
            for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                if (gAccounts[idxAccounts].accountId == sAccountId) {
                    let oAccount = new Account();
                    oAccount = gAccounts[idxAccounts];
                    let bAddOrdersForThisAccount = false;
                    if (oAccount.positions.length > 0) {
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                    bAddOrdersForThisAccount = true;
                                    break;
                                }
                            }
                        }
                        if (bAddOrdersForThisAccount) {
                            gTDOrders.length = 0;
                            for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                                let oPosition = new Position();
                                oPosition = oAccount.positions[idxPosition];
                                if (oPosition.assetType == "EQUITY") {
                                    if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                        let oTDOrder = new TDOrder();
                                        oTDOrder.a02orderType = oTDOrder.a02orderType + "\"LIMIT\", ";
                                        oTDOrder.a04duration = oTDOrder.a04duration + "\"GOOD_TILL_CANCEL\", ";
                                        oTDOrder.a03FcancelTime = oTDOrder.a03FcancelTime + "\"" + sCancelTime + "\", ";
                                        oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";
                                        let iNumToBuy = oPosition.longQuantity * (iSelectNum / 100.0);
                                        if (iNumToBuy >= 1.0) {
                                            iNumToBuy = Math.floor(iNumToBuy);
                                        } else if (iNumToBuy > 0.0) {
                                            iNumToBuy = 1;
                                        } else {
                                            iNumToBuy = 0;
                                        }
                                        if (iNumToBuy > 0) {
                                            //get the price to use
                                            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                                                if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                                                    let oWatchList = new WLWatchList();
                                                    let oWatchListItem = new WLItem();
                                                    oWatchList = gWatchlists[idxWL];
                                                    oWatchListItem = oWatchList.WLItems[idxWLItem];
                                                    let sSymbol = oWatchListItem.symbol;
                                                    if (sSymbol == oPosition.symbol) {
                                                        for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                                                            let oWLDisplayed = new WLDisplayed();
                                                            oWLDisplayed = gWLDisplayed[idxDisplayed];
                                                            let oWLItemDetail = new WLItemDetail();
                                                            if (sSymbol == oWLDisplayed.symbol) {
                                                                for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                                                                    oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];
                                                                    let dPrice = oWLItemDetail.regularMarketLastPrice;
                                                                    let sPrice = FormatMoney(dPrice);
                                                                    if (parseFloat(sPrice) > 0) {
                                                                        oTDOrder.a02Aprice = oTDOrder.a02Aprice + "\"" + sPrice + "\", ";
                                                                        oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                                                                        oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                                                                        oTDOrder.symbol = sSymbol;
                                                                        gTDOrders[gTDOrders.length] = oTDOrder;
                                                                    }
                                                                    break;
                                                                    //if ((oWatchList.accountId == oWLItemDetail.accountId) || (!bExisting)) {
                                                                    //    let dPrice = oWLItemDetail.regularMarketLastPrice;
                                                                    //    let sPrice = FormatMoney(dPrice);
                                                                    //    if (parseFloat(sPrice) > 0) {
                                                                    //        oTDOrder.a02Aprice = oTDOrder.a02Aprice + "\"" + sPrice + "\", ";
                                                                    //        oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                                                                    //        oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                                                                    //        oTDOrder.symbol = sSymbol;
                                                                    //        gTDOrders[gTDOrders.length] = oTDOrder;
                                                                    //    }
                                                                    //    break;
                                                                    //}
                                                                }
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //create orders here
                            if (gTDOrders.length > 0) {
                                gTDOrders.sort(sortBySymbol);
                                gbDoingCreateOrders = true;
                                SetWait();
                                window.setTimeout("PostWLBuyOrdersLimit(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
                            } else {
                                alert("No orders were generated for this watchlist.");
                            }
                        } else {
                            alert("No positions selected.");
                        }
                    } else {
                        alert("There are no positions in this watchlist.");
                    }
                    break;
                }
            }
        }
    } else {
        //then buying dSelectNum's worth of shares for each stock in the watchlist
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                let oWatchList = new WLWatchList();
                let oWatchListItem = new WLItem();
                oWatchList = gWatchlists[idxWL];
                oWatchListItem = oWatchList.WLItems[idxWLItem];
                let sSymbol = oWatchListItem.symbol;
                for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                    let oWLDisplayed = new WLDisplayed();
                    oWLDisplayed = gWLDisplayed[idxDisplayed];
                    let oWLItemDetail = new WLItemDetail();
                    if (sSymbol == oWLDisplayed.symbol) {
                        for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                            oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];

                            let oTDOrder = new TDOrder();

                            oTDOrder.a02orderType = oTDOrder.a02orderType + "\"LIMIT\", ";
                            oTDOrder.a04duration = oTDOrder.a04duration + "\"GOOD_TILL_CANCEL\", ";
                            oTDOrder.a03FcancelTime = oTDOrder.a03FcancelTime + "\"" + sCancelTime + "\", ";
                            oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";

                            let iNumToBuy = Math.floor(dSelectNum / oWLItemDetail.regularMarketLastPrice);
                            if (iNumToBuy > 0) {
                                let sPrice = FormatMoney(oWLItemDetail.regularMarketLastPrice);
                                if (parseFloat(sPrice) > 0) {
                                    oTDOrder.a02Aprice = oTDOrder.a02Aprice + "\"" + sPrice + "\", ";
                                    oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                                    oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                                    oTDOrder.symbol = sSymbol;
                                    gTDOrders[gTDOrders.length] = oTDOrder;
                                }
                            }

                            //if ((oWatchList.accountId == oWLItemDetail.accountId) || (!bExisting)) {
                            //    let oTDOrder = new TDOrder();

                            //    oTDOrder.a02orderType = oTDOrder.a02orderType + "\"LIMIT\", ";
                            //    oTDOrder.a04duration = oTDOrder.a04duration + "\"GOOD_TILL_CANCEL\", ";
                            //    oTDOrder.a03FcancelTime = oTDOrder.a03FcancelTime + "\"" + sCancelTime + "\", ";
                            //    oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"BUY\", ";

                            //    let iNumToBuy = Math.floor(dSelectNum / oWLItemDetail.regularMarketLastPrice);
                            //    if (iNumToBuy > 0) {
                            //        let sPrice = FormatMoney(oWLItemDetail.regularMarketLastPrice);
                            //        if (parseFloat(sPrice) > 0) {
                            //            oTDOrder.a02Aprice = oTDOrder.a02Aprice + "\"" + sPrice + "\", ";
                            //            oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToBuy.toString() + ", ";
                            //            oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + sSymbol + "\", "
                            //            oTDOrder.symbol = sSymbol;
                            //            gTDOrders[gTDOrders.length] = oTDOrder;
                            //        }
                            //    }
                            //}
                            break;
                        }
                    }
                }
            }
        }
        if (gTDOrders.length > 0) {
            gTDOrders.sort(sortBySymbol);
            gbDoingCreateOrders = true;
            SetWait();
            window.setTimeout("PostWLBuyOrdersLimit(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
        } else {
            alert("No orders were generated for this watchlist.");
        }
    }

}

function GenerateWLCloseSymbolOrders(sAccountId, dSelectNum, idxWL, sSymbol) {
    //debugger
    gTDWLOrders.length = 0;
    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
        if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) && (gWatchlists[idxWL].WLItems[idxWLItem].symbol == sSymbol)) {
            let oTDWLOrder = new TDWLOrder();
            oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
            oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
            oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + gWatchlists[idxWL].WLItems[idxWLItem].sequenceId + ", ";
            if (dSelectNum < 0.0) {
                dSelectNum = (-1 * dSelectNum) + 1000000.0;
            }
            oTDWLOrder.aWL07commission = oTDWLOrder.aWL07commission + FormatDecimalNumber(dSelectNum, 5, 2, "") + ", ";
            oTDWLOrder.aWL09symbol = oTDWLOrder.aWL09symbol + "\"" + gWatchlists[idxWL].WLItems[idxWLItem].symbol + "\" ,";
            oTDWLOrder.symbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
            gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;
        }
    }
    //create orders here
    if (gTDWLOrders.length > 0) {
        gTDWLOrders.sort(sortBySymbol);
        gbDoingCreateOrders = true;
        SetWait();
        window.setTimeout("PostWLCloseSymbolOrders(true, 0, 0, 0, " + (gTDWLOrders.length - 1).toString() + ", '" + sAccountId + "', '" + gWatchlists[idxWL].watchlistId + "', 0, " + idxWL.toString() + ")", 10);
    } else {
        alert("No symbols were closed.");
    }
}

function GenerateWLDeleteSymbolOrders(sAccountId, idxWL, sSequenceIds) {
    gTDWLOrders.length = 0;

    let vSequenceIds = sSequenceIds.split(", ");
    for (let idxSequenceId = 0; idxSequenceId < vSequenceIds.length; idxSequenceId++) {
        let oTDWLOrder = new TDWLOrder();
        oTDWLOrder.bDoingPurchasedDateClear = true;
        oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
        oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
        oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + vSequenceIds[idxSequenceId] + " ";
        oTDWLOrder.aWL05quantity = "";
        oTDWLOrder.aWL06averagePrice = "";
        oTDWLOrder.aWL07commission = "";
        oTDWLOrder.aWL07purchasedDate = "";
        oTDWLOrder.aWL08instrumentStart = "";
        oTDWLOrder.aWL09symbol = "";
        oTDWLOrder.aWL10assetType = "";
        oTDWLOrder.aWL11instrumentEnd = "";
        gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;

    }

    if (gTDWLOrders.length > 0) {
        //gTDWLOrders.sort(sortBySymbol);
        gbDoingCreateOrders = true;
        SetWait();
        window.setTimeout("PostWLDeleteSymbolOrders(true, 0, 0, 0, " + (gTDWLOrders.length - 1).toString() + ", '" + sAccountId + "', '" + gWatchlists[idxWL].watchlistId + "', 0, " + idxWL.toString() + ")", 10);
    } else {
        alert("No symbols were deleted.");
    }
}

function GenerateWLOpenSymbolOrders(sAccountId, idxWL, sSymbolsToLookup, sPurchasedDate) {
    gTDWLOrders.length = 0;

    if (sSymbolsToLookup == "") {
        if (sPurchasedDate == "") {
            //generate all deletes then generate all inserts
            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                    let oTDWLOrder = new TDWLOrder();
                    oTDWLOrder.bDoingPurchasedDateClear = true;
                    oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
                    oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
                    oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + gWatchlists[idxWL].WLItems[idxWLItem].sequenceId + " ";
                    oTDWLOrder.aWL05quantity = "";
                    oTDWLOrder.aWL06averagePrice = "";
                    oTDWLOrder.aWL07commission = "";
                    oTDWLOrder.aWL07purchasedDate = "";
                    oTDWLOrder.aWL08instrumentStart = "";
                    oTDWLOrder.aWL09symbol = "";
                    oTDWLOrder.aWL10assetType = "";
                    oTDWLOrder.aWL11instrumentEnd = "";
                    oTDWLOrder.symbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                    gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;
                }
            }
            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                    let oTDWLOrder = new TDWLOrder();
                    oTDWLOrder.bDoingPurchasedDateClear = true;
                    oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
                    oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
                    //oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + (1000 + idxWLItem).toString() + ", ";
                    oTDWLOrder.aWL04sequenceId = "";
                    if (gWatchlists[idxWL].WLItems[idxWLItem].priceInfo.averagePrice != 0) {
                        let dAveragePrice = gWatchlists[idxWL].WLItems[idxWLItem].priceInfo.averagePrice;
                        if (dAveragePrice < 0) {
                            dAveragePrice = (dAveragePrice * -1) + 1000000;
                        }
                        oTDWLOrder.aWL07commission = oTDWLOrder.aWL07commission + FormatDecimalNumber(dAveragePrice, 5, 2, "") + ", ";
                    } else {
                        oTDWLOrder.aWL07commission = "";
                    }
                    oTDWLOrder.aWL07purchasedDate = "";
                    oTDWLOrder.aWL09symbol = oTDWLOrder.aWL09symbol + "\"" + gWatchlists[idxWL].WLItems[idxWLItem].symbol + "\" ,";
                    oTDWLOrder.symbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                    gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;
                }
            }
        } else {
            //generate all updates
            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                    let oTDWLOrder = new TDWLOrder();
                    oTDWLOrder.bDoingPurchasedDateUpdate = true;
                    oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
                    oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
                    oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + gWatchlists[idxWL].WLItems[idxWLItem].sequenceId + ", ";
                    oTDWLOrder.aWL05quantity = "";
                    oTDWLOrder.aWL06averagePrice = "";
                    oTDWLOrder.aWL07commission = "";
                    oTDWLOrder.aWL07purchasedDate = oTDWLOrder.aWL07purchasedDate + "\"" + sPurchasedDate + "\" ";
                    oTDWLOrder.aWL08instrumentStart = "";
                    oTDWLOrder.aWL09symbol = "";
                    oTDWLOrder.aWL10assetType = "";
                    oTDWLOrder.aWL11instrumentEnd = "";
                    oTDWLOrder.symbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                    gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;
                }
            }
        }
        //for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
        //    if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
        //        let oTDWLOrder = new TDWLOrder();
        //        oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
        //        oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
        //        oTDWLOrder.aWL04sequenceId = oTDWLOrder.aWL04sequenceId + gWatchlists[idxWL].WLItems[idxWLItem].sequenceId + ", ";
        //        oTDWLOrder.aWL07commission = "";
        //        if (sPurchasedDate == "") {
        //            oTDWLOrder.aWL07purchasedDate = "";
        //        } else {
        //            oTDWLOrder.aWL07purchasedDate = oTDWLOrder.aWL07purchasedDate + "\"" + sPurchasedDate + "\", ";
        //        }
        //        oTDWLOrder.aWL09symbol = oTDWLOrder.aWL09symbol + "\"" + gWatchlists[idxWL].WLItems[idxWLItem].symbol + "\" ,";
        //        oTDWLOrder.symbol = gWatchlists[idxWL].WLItems[idxWLItem].symbol;
        //        gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;
        //    }
        //}

    } else {

        let vSymbols = sSymbolsToLookup.split(",");

        for (let idxSymbol = 0; idxSymbol < vSymbols.length; idxSymbol++) {
            let oTDWLOrder = new TDWLOrder();
            oTDWLOrder.bDoingAddNewSymbols = true;
            oTDWLOrder.aWL01name = oTDWLOrder.aWL01name + "\"" + gWatchlists[idxWL].name + "\", ";
            oTDWLOrder.aWL02watchlistId = oTDWLOrder.aWL02watchlistId + "\"" + gWatchlists[idxWL].watchlistId + "\", ";
            oTDWLOrder.aWL04sequenceId = "";
            oTDWLOrder.aWL07commission = oTDWLOrder.aWL07commission + "0, ";
            if (sPurchasedDate == "") {
                oTDWLOrder.aWL07purchasedDate = "";
            } else {
                oTDWLOrder.aWL07purchasedDate = oTDWLOrder.aWL07purchasedDate + "\"" + sPurchasedDate + "\", ";
            }
            oTDWLOrder.aWL09symbol = oTDWLOrder.aWL09symbol + "\"" + vSymbols[idxSymbol] + "\" ,";
            oTDWLOrder.symbol = vSymbols[idxSymbol];
            gTDWLOrders[gTDWLOrders.length] = oTDWLOrder;

        }
    }
    //create orders here
    if (gTDWLOrders.length > 0) {
        //gTDWLOrders.sort(sortBySymbol);
        gbDoingCreateOrders = true;
        SetWait();
        window.setTimeout("PostWLOpenSymbolOrders(true, 0, 0, 0, " + (gTDWLOrders.length - 1).toString() + ", '" + sAccountId + "', '" + gWatchlists[idxWL].watchlistId + "', 0, " + idxWL.toString() + ")", 10);
    } else {
        alert("No symbols were added.");
    }
}

function GenerateWLSellOrders(sAccountId, iSelectNum, sSymbolsThisWL, idxWL) {
    //let sSummary = "";
    //let sSummarySep = "";
    //let aTDOrderSummary = new Array();
    //have percentage to sell so now get all of the symbols for this account
    if (gAccounts.length > 0) {
        for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
            if (gAccounts[idxAccounts].accountId == sAccountId) {
                let oAccount = new Account();
                oAccount = gAccounts[idxAccounts];
                let bAddOrdersForThisAccount = false;
                if (oAccount.positions.length > 0) {
                    for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                        let oPosition = new Position();
                        oPosition = oAccount.positions[idxPosition];
                        if (oPosition.assetType == "EQUITY") {
                            if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                bAddOrdersForThisAccount = true;
                                break;
                            }
                        }
                    }
                    if (bAddOrdersForThisAccount) {
                        gTDOrders.length = 0;
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                    let oTDOrder = new TDOrder();
                                    oTDOrder.a02orderType = oTDOrder.a02orderType + "\"MARKET\", ";
                                    oTDOrder.a04duration = oTDOrder.a04duration + "\"DAY\", ";
                                    oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"SELL\", ";
                                    let iNumToSell = 0;
                                    if (oPosition.longQuantity == 1) {
                                        if (iSelectNum == 100) {
                                            iNumToSell = 1;
                                        } else {
                                            iNumToSell = 0;
                                        }
                                    } else {
                                        iNumToSell = oPosition.longQuantity * (iSelectNum / 100.0);
                                        if (iNumToSell >= 1.0) {
                                            iNumToSell = Math.floor(iNumToSell);
                                        } else if (iNumToSell > 0.1) {
                                            iNumToSell = 1;
                                        } else {
                                            iNumToSell = 0;
                                        }
                                    }
                                    if (iNumToSell > 0) {
                                        oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToSell.toString() + ", ";
                                        oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + oPosition.symbol + "\", "
                                        oTDOrder.symbol = oPosition.symbol;
                                        //let oTDOrderSummary = new TDOrderSummary();
                                        //oTDOrderSummary.shares = iNumToSell;
                                        //oTDOrderSummary.symbol = oPosition.symbol;
                                        //aTDOrderSummary[aTDOrderSummary.length] = oTDOrderSummary;
                                        gTDOrders[gTDOrders.length] = oTDOrder;
                                    }
                                }
                            }
                        }
                        //aTDOrderSummary.sort(sortBySymbol);
                        //sSummary = "Your have selected to sell:"
                        //sSummarySep = gsCRLF;
                        //let idxOrder = 0;
                        //while (idxOrder < aTDOrderSummary.length) {
                        //    sSummary = sSummary + sSummarySep + aTDOrderSummary[idxOrder].shares + " shares of " + aTDOrderSummary[idxOrder].symbol;
                        //    idxOrder++;
                        //    if (idxOrder < aTDOrderSummary.length) {
                        //        sSummary = sSummary + "     " + aTDOrderSummary[idxOrder].shares + " shares of " + aTDOrderSummary[idxOrder].symbol;
                        //    }
                        //    idxOrder++;
                        //    if (idxOrder < aTDOrderSummary.length) {
                        //        sSummary = sSummary + "     " + aTDOrderSummary[idxOrder].shares + " shares of " + aTDOrderSummary[idxOrder].symbol;
                        //    }
                        //    idxOrder++;
                        //}
                        //alert(sSummary);


                        //create orders here
                        if (gTDOrders.length > 0) {
                            gTDOrders.sort(sortBySymbol);
                            gbDoingCreateOrders = true;
                            SetWait();
                            window.setTimeout("PostWLSellOrders(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
                        } else {
                            alert("No orders were generated for this watchlist.");
                        }
                    } else {
                        alert("No positions selected.");
                    }
                } else {
                    alert("There are no positions in this watchlist.");
                }
                break;
            }
        }
    }

}

function GenerateWLSellOrdersLimit(sAccountId, iSelectNum, sSymbolsThisWL, idxWL) {
    //have percentage to sell so now get all of the symbols for this account
    let dtCancelTime = new Date(); //get todays date
    dtCancelTime.setMonth(dtCancelTime.getMonth() + 4);
    let sCancelTime = FormatDateForTD(dtCancelTime);

    if (gAccounts.length > 0) {
        for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
            if (gAccounts[idxAccounts].accountId == sAccountId) {
                let oAccount = new Account();
                oAccount = gAccounts[idxAccounts];
                let bAddOrdersForThisAccount = false;
                if (oAccount.positions.length > 0) {
                    for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                        let oPosition = new Position();
                        oPosition = oAccount.positions[idxPosition];
                        if (oPosition.assetType == "EQUITY") {
                            if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                bAddOrdersForThisAccount = true;
                                break;
                            }
                        }
                    }
                    if (bAddOrdersForThisAccount) {
                        gTDOrders.length = 0;
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                    let oTDOrder = new TDOrder();
                                    oTDOrder.a02orderType = oTDOrder.a02orderType + "\"LIMIT\", ";
                                    oTDOrder.a04duration = oTDOrder.a04duration + "\"GOOD_TILL_CANCEL\", ";
                                    oTDOrder.a03FcancelTime = oTDOrder.a03FcancelTime + "\"" + sCancelTime + "\", ";
                                    oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"SELL\", ";
                                    let iNumToSell = 0;
                                    if (oPosition.longQuantity == 1) {
                                        if (iSelectNum == 100) {
                                            iNumToSell = 1;
                                        } else {
                                            iNumToSell = 0;
                                        }
                                    } else {
                                        iNumToSell = oPosition.longQuantity * (iSelectNum / 100.0);
                                        if (iNumToSell >= 1.0) {
                                            iNumToSell = Math.floor(iNumToSell);
                                        } else if (iNumToSell > 0.1) {
                                            iNumToSell = 1;
                                        } else {
                                            iNumToSell = 0;
                                        }
                                    }
                                    if (iNumToSell > 0) {
                                        //get the price to use
                                        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                                            if ((gWatchlists[idxWL].WLItems[idxWLItem].bSelected) && (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder)) {
                                                let oWatchList = new WLWatchList();
                                                let oWatchListItem = new WLItem();
                                                oWatchList = gWatchlists[idxWL];
                                                oWatchListItem = oWatchList.WLItems[idxWLItem];
                                                let sSymbol = oWatchListItem.symbol;
                                                if (sSymbol == oPosition.symbol) {
                                                    for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                                                        let oWLDisplayed = new WLDisplayed();
                                                        oWLDisplayed = gWLDisplayed[idxDisplayed];
                                                        let oWLItemDetail = new WLItemDetail();
                                                        if (sSymbol == oWLDisplayed.symbol) {
                                                            for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                                                                oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];
                                                                if (oWatchList.accountId == oWLItemDetail.accountId) {
                                                                    let dPrice = oWLItemDetail.regularMarketLastPrice - (oWLItemDetail.regularMarketLastPrice * .01);
                                                                    let sPrice = FormatMoney(dPrice);
                                                                    if (parseFloat(sPrice) > 0) {
                                                                        oTDOrder.a02Aprice = oTDOrder.a02Aprice + "\"" + sPrice + "\", ";
                                                                        oTDOrder.a08quantity = oTDOrder.a08quantity + iNumToSell.toString() + ", ";
                                                                        oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + oPosition.symbol + "\", "
                                                                        oTDOrder.symbol = oPosition.symbol;
                                                                        gTDOrders[gTDOrders.length] = oTDOrder;
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //create orders here
                        if (gTDOrders.length > 0) {
                            gTDOrders.sort(sortBySymbol);
                            gbDoingCreateOrders = true;
                            SetWait();
                            window.setTimeout("PostWLSellOrdersLimit(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
                        } else {
                            alert("No orders were generated for this watchlist.");
                        }
                    } else {
                        alert("No positions selected.");
                    }
                } else {
                    alert("There are no positions in this watchlist.");
                }
                break;
            }
        }
    }

}

function GenerateWLTrailingStopOrders(sAccountId, iSelectNum, sSymbolsThisWL, idxWL) {
    //get cancel time
    let dtCancelTime = new Date(); //get todays date
    dtCancelTime.setMonth(dtCancelTime.getMonth() + 4);
    let sCancelTime = FormatDateForTD(dtCancelTime);

    //have percentage to sell so now get all of the symbols for this account
    if (gAccounts.length > 0) {
        for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
            if (gAccounts[idxAccounts].accountId == sAccountId) {
                let oAccount = new Account();
                oAccount = gAccounts[idxAccounts];
                let bAddOrdersForThisAccount = false;
                if (oAccount.positions.length > 0) {
                    for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                        let oPosition = new Position();
                        oPosition = oAccount.positions[idxPosition];
                        if (oPosition.assetType == "EQUITY") {
                            if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                bAddOrdersForThisAccount = true;
                                break;
                            }
                        }
                    }
                    if (bAddOrdersForThisAccount) {
                        gTDOrders.length = 0;
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                if (sSymbolsThisWL.indexOf("," + oPosition.symbol.toUpperCase() + ",") != -1) {
                                    let oTDOrder = new TDOrder();
                                    oTDOrder.a02orderType = oTDOrder.a02orderType + "\"TRAILING_STOP\", ";
                                    oTDOrder.a04duration = oTDOrder.a04duration + "\"GOOD_TILL_CANCEL\", ";
                                    oTDOrder.a07instructionStart = oTDOrder.a07instructionStart + "\"SELL\", ";
                                    oTDOrder.a03DstopPriceOffset = oTDOrder.a03DstopPriceOffset + iSelectNum.toString() + ", ";
                                    oTDOrder.a03FcancelTime = oTDOrder.a03FcancelTime + "\"" + sCancelTime + "\", ";
                                    oTDOrder.a08quantity = oTDOrder.a08quantity + oPosition.longQuantity.toString() + ", ";
                                    oTDOrder.a10symbol = oTDOrder.a10symbol + "\"" + oPosition.symbol + "\", "
                                    oTDOrder.symbol = oPosition.symbol;
                                    gTDOrders[gTDOrders.length] = oTDOrder;
                                }
                            }
                        }
                        //create orders here
                        if (gTDOrders.length > 0) {
                            gTDOrders.sort(sortBySymbol);
                            gbDoingCreateOrders = true;
                            SetWait();
                            window.setTimeout("PostWLTrailingStopOrders(true, 0, 0, 0, " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 10);
                        } else {
                            alert("No orders were generated for this watchlist.");
                        }
                    } else {
                        alert("No positions selected.");
                    }
                } else {
                    alert("There are no positions in this watchlist.");
                }
                break;
            }
        }
    }

}

function GetAccessCode() {
    let iTryCount = 0;
    let oCM;
    //debugger
    let urlEncodedData = "",
        urlEncodedDataPairs = [];

    urlEncodedDataPairs.push("grant_type=" + DoURLEncode("authorization_code"));
    urlEncodedDataPairs.push("access_type=" + DoURLEncode("offline"));
    urlEncodedDataPairs.push("code=" + gsBearerCode);
    urlEncodedDataPairs.push("client_id=" + DoURLEncode(gsTDAPIKey));
    urlEncodedDataPairs.push("redirect_uri=" + DoURLEncode(gsRedirectURL));
    //urlEncodedDataPairs.push("redirect_uri=" + DoURLEncode("https://localhost:8080"));



    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(" ", '+');

    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------
        let sServerUrl = "https://api.tdameritrade.com/v1/oauth2/token"

        let xhttp = null;
        let iInnerTryCount = 0;
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpen(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            // send the request
            try {
                //debugger
                xhttp.send(urlEncodedData);
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        //alert("GetAccessCode xhttp.responseText = " + xhttp.responseText);

                        oCM = myJSON.parse(xhttp.responseText);
                        checkTDAPIError(oCM);
                        gAccessToken.access_token = oCM["access_token"];
                        if (!isUndefined(oCM["refresh_token"])) {
                            gAccessToken.refresh_token = DoURLEncode(oCM["refresh_token"]);
                        }
                        //gAccessToken.refresh_token = oCM["refresh_token"];
                        gAccessToken.token_type = oCM["token_type"];
                        gAccessToken.expires_in = oCM["expires_in"];
                        gAccessToken.scope = oCM["scope"];
                        gAccessToken.refresh_token_expires_in = oCM["refresh_token_expires_in"];
                        gAccessToken.access_token_expiration_time = (new Date()) + gAccessToken.expires_in;

                        iTryCount = 2;
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("GetAccessCode Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        //alert ("GetAccessCode Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                    }
                }
            }
            catch (e1) {
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    alert("GetAccessCode Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                }
            }
        }
        else {
            break;
        }
    }
}

function GetAccessCodeUsingRefreshToken() {
    let iTryCount = 0;
    let oCM;
    let bReturn = false;

    //debugger

    let urlEncodedData = "",
        urlEncodedDataPairs = [];

    urlEncodedDataPairs.push("grant_type=" + DoURLEncode("refresh_token"));
    //urlEncodedDataPairs.push("refresh_token=" + DoURLEncode(gAccessToken.refresh_token));
    urlEncodedDataPairs.push("refresh_token=" + gAccessToken.refresh_token);
    urlEncodedDataPairs.push("client_id=" + DoURLEncode(gsTDAPIKey));


    // Combine the pairs into a single string and replace all %-encoded spaces to 
    // the '+' character; matches the behaviour of browser form submissions.
    urlEncodedData = urlEncodedDataPairs.join('&').replace(" ", '+');

    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------
        let sServerUrl = "https://api.tdameritrade.com/v1/oauth2/token"

        let xhttp = null;
        let iInnerTryCount = 0;
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpen(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            // send the request
            try {
                //debugger
                xhttp.send(urlEncodedData);
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        //alert("GetAccessCodeUsingRefreshToken xhttp.responseText = " + xhttp.responseText);

                        oCM = myJSON.parse(xhttp.responseText);
                        checkTDAPIError(oCM);
                        gAccessToken.access_token = oCM["access_token"];
                        gAccessToken.expires_in = oCM["expires_in"];
                        gAccessToken.access_token_expiration_time = (new Date()) + gAccessToken.expires_in;

                        //                            document.getElementById("tdLoggedOnAs").innerHTML = "<b>Logged on as: " + gsLogonUser + "</b>&nbsp;Access Token Expiration:&nbsp;" + FormatDateWithTime(new Date((new Date()).getTime() + (gAccessToken.expires_in * 1000)), true, false);
                        document.getElementById("spanLoggedOnAs").innerHTML = "<b>Logged on as: " + gsLogonUser + "</b>";


                        iTryCount = 2;
                        bReturn = true;
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("GetAccessCodeUsingRefreshToken Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        //alert ("GetAccessCodeUsingRefreshToken Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                    }
                }
            }
            catch (e1) {
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    alert("GetAccessCodeUsingRefreshToken Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                }
            }
        }
        else {
            break;
        }
    }
    return bReturn;
}

function GetAccounts() {
    gsLogonUser = oACCP["userId"];
    gAccounts.length = 0;
    if (oACCP["accounts"].length > 0) {
        for (let idx = 0; idx < oACCP["accounts"].length; idx++) {
            let oAccount = new Account();
            oAccount.accountId = oACCP["accounts"][idx].accountId;
            oAccount.accountName = oACCP["accounts"][idx].displayName;

            gAccounts[gAccounts.length] = oAccount;
        }
    }
}

function GetAccountsDetails() {

    if (oACC.length > 0) {
        for (let idx = 0; idx < oACC.length; idx++) {
            for (let idxAccount = 0; idxAccount < gAccounts.length; idxAccount++) {
                if (gAccounts[idxAccount].accountId == oACC[idx].securitiesAccount.accountId) {
                    gAccounts[idxAccount].CBliquidationValue = oACC[idx].securitiesAccount.currentBalances.liquidationValue;
                    gAccounts[idxAccount].CBcashBalance = oACC[idx].securitiesAccount.currentBalances.cashBalance;
                    gAccounts[idxAccount].IBliquidationValue = oACC[idx].securitiesAccount.initialBalances.liquidationValue;
                    gAccounts[idxAccount].positions.length = 0;
                    //get the positions for this account
                    if (oACC[idx].securitiesAccount.positions != undefined) {
                        for (let idxPosition = 0; idxPosition < oACC[idx].securitiesAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition.averagePrice = oACC[idx].securitiesAccount.positions[idxPosition].averagePrice;
                            oPosition.currentDayProfitLoss = oACC[idx].securitiesAccount.positions[idxPosition].currentDayProfitLoss;
                            oPosition.currentDayProfitLossPercentage = oACC[idx].securitiesAccount.positions[idxPosition].currentDayProfitLossPercentage;
                            oPosition.longQuantity = oACC[idx].securitiesAccount.positions[idxPosition].longQuantity;
                            oPosition.marketValue = oACC[idx].securitiesAccount.positions[idxPosition].marketValue;
                            oPosition.assetType = oACC[idx].securitiesAccount.positions[idxPosition].instrument.assetType;
                            oPosition.symbol = oACC[idx].securitiesAccount.positions[idxPosition].instrument.symbol;
                            gAccounts[idxAccount].positions[gAccounts[idxAccount].positions.length] = oPosition;
                        }
                    }
                }
            }
        }
    }
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    let cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if (name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}

function GetCurrentPrice(sSymbol) {

    //returns SymbolPrice object
    let iTryCount = 0;
    let dReturnVal = 0.0;
    let oSymbolPrice = new SymbolPrice();

    let oCM;

    let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/" + sSymbol + "/quotes";
    //let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/quotes?&symbol=" + DoURLEncode(sSymbol);

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------
        let sServerUrl = sServerUrlBase;

        let xhttp = null;
        let iInnerTryCount = 0;
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

            // send the request
            try {
                //debugger
                xhttp.send();
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        //alert("GetCurrentPrice xhttp.responseText length = " + xhttp.responseText.length);

                        oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIError(oCM)) {
                            case 0: //no error
                                {
                                    if (oCM[sSymbol].description == undefined) {
                                        oSymbolPrice.description = "";
                                    } else {
                                        oSymbolPrice.description = oCM[sSymbol].description;
                                    }
                                    if (oCM[sSymbol].quoteTimeInLong == undefined) {
                                        oSymbolPrice.quoteTimeInLong = 0;
                                    } else {
                                        oSymbolPrice.quoteTimeInLong = oCM[sSymbol].quoteTimeInLong;
                                    }
                                    if (oCM[sSymbol].tradeTimeInLong == undefined) {
                                        oSymbolPrice.tradeTimeInLong = 0;
                                    } else {
                                        oSymbolPrice.tradeTimeInLong = oCM[sSymbol].tradeTimeInLong;
                                    }
                                    if (oCM[sSymbol].totalVolume == undefined) {
                                        oSymbolPrice.totalVolume = 0;
                                    } else {
                                        oSymbolPrice.totalVolume = oCM[sSymbol].totalVolume;
                                    }
                                    if (oCM[sSymbol].lastPrice == undefined) {
                                        oSymbolPrice.description = "Price not found.";
                                        oSymbolPrice.price = 0.0;
                                    } else {
                                        oSymbolPrice.price = oCM[sSymbol].lastPrice;
                                    }
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                        return;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    break;
                                }
                            default:
                                {
                                    break;
                                }
                        }

                        iTryCount = 2;
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("GetCurrentPrice Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        //alert ("GetCurrentPrice Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    //alert("GetCurrentPrice Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                }
            }
        }
        else {
            break;
        }
    }
    return oSymbolPrice;

}

function GetCurrentPriceOption(sSymbol) {

    //returns SymbolPrice object
    let iTryCount = 0;
    let dReturnVal = 0.0;
    let oSymbolPrice = new SymbolPrice();

    let oCM;

    let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/" + sSymbol + "/quotes";
    //let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/quotes?&symbol=" + DoURLEncode(sSymbol);

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------
        let sServerUrl = sServerUrlBase;

        let xhttp = null;
        let iInnerTryCount = 0;
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

            // send the request
            try {
                //debugger
                xhttp.send();
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        //alert("GetCurrentPriceOption xhttp.responseText length = " + xhttp.responseText.length);

                        oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIError(oCM)) {
                            case 0: //no error
                                {
                                    if (oCM[sSymbol].description == undefined) {
                                        oSymbolPrice.description = "";
                                    } else {
                                        oSymbolPrice.description = oCM[sSymbol].description;
                                    }
                                    oSymbolPrice.description = oCM[sSymbol].description;
                                    if (oCM[sSymbol].mark == undefined) {
                                        oSymbolPrice.description = "Price not found.";
                                        oSymbolPrice.price = 0.0;
                                    } else {
                                        oSymbolPrice.price = oCM[sSymbol].mark;
                                    }
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                        return;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    break;
                                }
                            default:
                                {
                                    break;
                                }
                        }

                        iTryCount = 2;
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("GetCurrentPriceOption Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        //alert ("GetCurrentPriceOption Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    alert("GetCurrentPriceOption Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                }
            }
        }
        else {
            break;
        }
    }
    return oSymbolPrice;

}

function GetCurrentPrices() {
    //returns SymbolPrice object
    let iTryCount = 0;
    let oCM;
    let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/quotes?&symbol="; // + DoURLEncode(sSymbols);
    let iSymbolLimit = 300;

    if (gSymbols.length > 0) {
        let sSymbols = "";
        let sSep = "";
        for (let idx = 0; idx < gSymbols.length; idx++) {
            sSymbols = sSymbols + sSep + gSymbols[idx].symbol;
            sSep = ",";
        }

        let sSymbolsToUse = GetUniqueListOfSymbols(sSymbols);

        let aServerUrls = new Array();
        let sServerUrl = "";
        let aSymbols = sSymbolsToUse.split(",");
        if (aSymbols.length > iSymbolLimit) {
            for (let idxXXX = 0; idxXXX < aSymbols.length; idxXXX = idxXXX + iSymbolLimit) {
                let iEnd = 0;
                let sThisSet = "";
                let sSep = "";
                if (idxXXX + iSymbolLimit < aSymbols.length) {
                    iEnd = idxXXX + iSymbolLimit;
                } else {
                    iEnd = aSymbols.length;
                }
                for (let idxSym = idxXXX; idxSym < iEnd; idxSym++) {
                    sThisSet = sThisSet + sSep + aSymbols[idxSym];
                    sSep = ",";
                }
                aServerUrls[aServerUrls.length] = sThisSet;
            }
        } else {
            aServerUrls[aServerUrls.length] = sSymbolsToUse;
        }

        for (let idxServerURL = 0; idxServerURL < aServerUrls.length; idxServerURL++) {
            sServerUrl = sServerUrlBase + DoURLEncode(aServerUrls[idxServerURL]);
            let sThisSetOfSymbols = "," + aServerUrls[idxServerURL] + ",";
            iTryCount = 0;
            while (iTryCount < 2) {
                let xhttp = null;
                let iInnerTryCount = 0;
                xhttp = oHTTP();
                while ((xhttp == null) && (iInnerTryCount < 5)) {
                    xhttp = oHTTP();
                    iInnerTryCount = iInnerTryCount + 1;
                }
                iInnerTryCount = 0;
                if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
                    // set the request header
                    xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

                    // send the request
                    try {
                        //debugger
                        xhttp.send();
                        if (xhttp.responseText != null) {
                            if (xhttp.responseText != "") {
                                //alert("GetCurrentPrice xhttp.responseText length = " + xhttp.responseText.length);
                                oCM = myJSON.parse(xhttp.responseText);
                                switch (checkTDAPIError(oCM)) {
                                    case 0: //no error
                                        {
                                            for (let idxSymbol = 0; idxSymbol < gSymbols.length; idxSymbol++) {
                                                let sSymbol = gSymbols[idxSymbol].symbol;
                                                if (sThisSetOfSymbols.indexOf("," + sSymbol + ",") != -1) {
                                                    if (oCM[sSymbol] != null) {
                                                        if (gSymbols[idxSymbol].assetType == "OPTION") {
                                                            if (oCM[sSymbol].description == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.description = "";
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.description = oCM[sSymbol].description;
                                                            }
                                                            if (oCM[sSymbol].mark == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.price = 0.0;
                                                                gSymbols[idxSymbol].SymbolPrice.description = "Option price not found";
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.price = oCM[sSymbol].mark;
                                                            }
                                                        } else {
                                                            if (oCM[sSymbol].description == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.description = "";
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.description = oCM[sSymbol].description;
                                                            }
                                                            if (oCM[sSymbol].quoteTimeInLong == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.quoteTimeInLong = 0;
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.quoteTimeInLong = oCM[sSymbol].quoteTimeInLong;
                                                            }
                                                            if (oCM[sSymbol].tradeTimeInLong == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.tradeTimeInLong = 0;
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.tradeTimeInLong = oCM[sSymbol].tradeTimeInLong;
                                                            }
                                                            if (oCM[sSymbol].totalVolume == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.totalVolume = 0;
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.totalVolume = oCM[sSymbol].totalVolume;
                                                            }
                                                            if (oCM[sSymbol].lastPrice == undefined) {
                                                                gSymbols[idxSymbol].SymbolPrice.price = 0.0;
                                                                gSymbols[idxSymbol].SymbolPrice.description = "Lastprice not found";
                                                            } else {
                                                                gSymbols[idxSymbol].SymbolPrice.price = oCM[sSymbol].lastPrice;
                                                            }
                                                        }
                                                    } else {
                                                        gSymbols[idxSymbol].SymbolPrice.description = "Symbol not returned";
                                                        //debugger
                                                    }
                                                }
                                            }
                                            iTryCount = 2;
                                            break;
                                        }
                                    case 1: //acces code expired
                                        {
                                            xhttp = null;
                                            if (GetAccessCodeUsingRefreshToken()) {
                                                iTryCount++;
                                            } else {
                                                alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                                return;
                                            }
                                            break;
                                        }
                                    case 2: //other error
                                        {
                                            iTryCount = 2;
                                            break;
                                        }
                                    default:
                                        {
                                            iTryCount = 2;
                                            break;
                                        }
                                }
                            }
                            else {
                                iTryCount++;
                                if (iTryCount < 2) {
                                    xhttp = null;
                                }
                                else {
                                    //alert ("GetCurrentPrice Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                                }
                            }
                        }
                        else {
                            iTryCount++;
                            if (iTryCount < 2) {
                                xhttp = null;
                            }
                            else {
                                //alert ("GetCurrentPrice Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                            }
                        }
                    }
                    catch (e1) {
                        //debugger
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert("GetCurrentPrice Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
    }
}

function GetIndexValues() {
    if (gMarketIndexes.length > 0) {
        for (let idxIndex = 0; idxIndex < gMarketIndexes.length; idxIndex++) {
            if (oMDQ[gMarketIndexes[idxIndex].symbol] != null) {
                if (gMarketIndexes[idxIndex].symbol == gsMarketsOilGasActual) {
                    gMarketIndexes[idxIndex].lastPrice = oMDQ[gMarketIndexes[idxIndex].symbol].lastPriceInDouble;
                    gMarketIndexes[idxIndex].netChange = oMDQ[gMarketIndexes[idxIndex].symbol].changeInDouble;
                    gMarketIndexes[idxIndex].netPercentChangeInDouble = (oMDQ[gMarketIndexes[idxIndex].symbol].changeInDouble / oMDQ[gMarketIndexes[idxIndex].symbol].closePriceInDouble) * 100;
                } else {
                    gMarketIndexes[idxIndex].lastPrice = oMDQ[gMarketIndexes[idxIndex].symbol].lastPrice;
                    //gMarketIndexes[idxIndex].netChange = 1000.00;
                    //gMarketIndexes[idxIndex].netPercentChangeInDouble = 100.00;
                    gMarketIndexes[idxIndex].netChange = oMDQ[gMarketIndexes[idxIndex].symbol].netChange;
                    gMarketIndexes[idxIndex].netPercentChangeInDouble = oMDQ[gMarketIndexes[idxIndex].symbol].netPercentChangeInDouble;
                }
                document.getElementById(gMarketIndexes[idxIndex].tdName).innerText = gMarketIndexes[idxIndex].description;
                document.getElementById(gMarketIndexes[idxIndex].tdName + "Value").innerText = FormatMoney(gMarketIndexes[idxIndex].lastPrice);
                if (gbMarketShowChangePercentage) {
                    if (gMarketIndexes[idxIndex].netPercentChangeInDouble < 0.0) {
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = FormatDecimalNumber(gMarketIndexes[idxIndex].netPercentChangeInDouble, 5, 2, "") + "%";
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = gsNegativeColor;
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
                    } else {
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = "+" + FormatDecimalNumber(gMarketIndexes[idxIndex].netPercentChangeInDouble, 5, 2, "") + "%";
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = "green";
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
                    }
                } else {
                    if (gMarketIndexes[idxIndex].netChange < 0.0) {
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = FormatMoney(gMarketIndexes[idxIndex].netChange);
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = gsNegativeColor;
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
                    } else {
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").value = "+" + FormatMoney(gMarketIndexes[idxIndex].netChange);
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.backgroundColor = "green";
                        document.getElementById(gMarketIndexes[idxIndex].tdName + "Change").style.color = "white";
                    }
                }

            }
        }
    }
    return;
}

function GetStockPriceHistory() {
    let iTryCount = 0;
    let idxCandle = 0;
    let bOk = false;
    let bErrorGettingData = false;

    let sServerUrlBase = "https://api.tdameritrade.com/v1/marketdata/aaaaaaa/pricehistory?startDate=xxxxxxx&endDate=yyyyyyy&needExtendedHoursData=zzzzzzz";

    let dShortTime = 0;
    let dLongTime = 0;

    let sStartDateShort = "";
    let sStartDateLong = "";
    let sStartDateShortOrig = "";
    let sStartDateLongOrig = "";

    let dDate = Date.now();

    let sEndDate = dDate.toString();
    let oPriceLastShort = new PriceInfo();
    let oPriceLastLong = new PriceInfo();

    let sTextAlignHeader = "center";
    let sTextAlign = "center";

    let skBackgroundColorNotSpecial = "#99CCFF";
    let skBackgroundColorShort = "green";
    let skBackgroundColorLong = "yellow";

    let skTextColorNotSpecial = "black";
    let skTextColorShort = "white";
    let skTextColorLong = "black";

    let sSymbolToLookup = "";
    let sSymbolsToLookupTmp = GetUniqueListOfSymbols(TrimLikeVB(document.getElementById("txtSymbols").value));

    let oCM;

    gbGettingStockPriceHistory = true;

    //if (!IsMarketOpen()) {
    //    if (!gbUseLastTradingDay) {
    //        alert("The market is currently closed. Click on Use last trading day.");
    //        gbDoingStockPriceHistory = false;
    //        gbGettingStockPriceHistory = false;
    //        SetDefault();
    //        return;
    //    }
    //}

    if (document.getElementById("txtShortTime").value == "") {
        dShortTime = 0;
    } else {
        dShortTime = parseInt(document.getElementById("txtShortTime").value);
    }
    if (document.getElementById("txtLongTime").value == "") {
        dLongTime = 0;
    } else {
        dLongTime = parseInt(document.getElementById("txtLongTime").value);
    }

    if ((dShortTime == 0) || (dLongTime == 0)) {
        alert("Please both short and long times greater than 0.");
        gbDoingStockPriceHistory = false;
        gbGettingStockPriceHistory = false;
        SetDefault();
        return;
    } else if (dLongTime <= dShortTime) {
        alert("The long time must be greater than the short time.");
        gbDoingStockPriceHistory = false;
        gbGettingStockPriceHistory = false;
        SetDefault();
        return;
    }

    if (sSymbolsToLookupTmp == "") {
        alert("Please enter at least one symbol.");
        gbDoingStockPriceHistory = false;
        gbGettingStockPriceHistory = false;
        SetDefault();
        return;
    }
    sSymbolsToLookup = sSymbolsToLookupTmp.split(",")

    if (gbUseLastTradingDay) {
        let sStartDate = document.getElementById("txtStartDate").value;
        if (!ValidateTDDate(sStartDate)) {
            gbDoingStockPriceHistory = false;
            gbGettingStockPriceHistory = false;
            SetDefault();
            return;
        }
        //debugger
        dDate = new Date(sStartDate + "T15:00:00.000Z");
        sStartDateLong = (dDate.getTime()).toString();
        sStartDateLongOrig = sStartDateLong;
        sEndDate = sStartDateLong

    } else {
        dDate = dDate - (dDate % 60000); //round down to nearest minute
        sStartDateShort = (dDate - (dShortTime * 60000)).toString();
        sStartDateShortOrig = sStartDateLong;
        sStartDateLong = (dDate - (dLongTime * 60000)).toString();
        sStartDateLongOrig = sStartDateLong;
    }

    //sStartDateShort = (dDate - (5 * 60000)).toString();
    //sStartDateLong = (dDate - (40 * 60000)).toString();


    //SetWait();

    gPriceInfo.length = 0;
    gPriceMinutes.length = 0;

    for (let idxSymbol = 0; idxSymbol < sSymbolsToLookup.length; idxSymbol++) {
        sSymbolToLookup = TrimLikeVB(sSymbolsToLookup[idxSymbol]).toUpperCase();
        if (sSymbolToLookup != "") {
            iTryCount = 0;
            oPriceLast = new PriceInfo();
            oPriceLastShort = oPriceLast.shortPIP;
            oPriceLastLong = oPriceLast.longPIP;
            oPriceLastLong.low = 1000000;
            oPriceLastShort.low = 1000000;
            oPriceLast.symbol = sSymbolToLookup;
            while (iTryCount < 2) {
                let sServerUrl = "";
                //-------------------------------------------------------------------------------------------------
                sServerUrl = sServerUrlBase.replace("xxxxxxx", sStartDateLongOrig);
                sServerUrl = sServerUrl.replace("yyyyyyy", sEndDate);
                sServerUrl = sServerUrl.replace("aaaaaaa", sSymbolToLookup);
                if (gbUseExtended) {
                    sServerUrl = sServerUrl.replace("zzzzzzz", "true");
                } else {
                    sServerUrl = sServerUrl.replace("zzzzzzz", "false");
                }

                let xhttp = null;
                let iInnerTryCount = 0;
                xhttp = oHTTP();
                while ((xhttp == null) && (iInnerTryCount < 5)) {
                    xhttp = oHTTP();
                    iInnerTryCount = iInnerTryCount + 1;
                }
                iInnerTryCount = 0;
                if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
                    // set the request header
                    xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

                    // send the request
                    try {
                        xhttp.send();
                        if (xhttp.responseText != null) {
                            if (xhttp.responseText != "") {
                                //might be something like - "error":"The access token being passed has expired or is invalid."

                                //alert("GetStockPriceHistory xhttp.responseText length = " + xhttp.responseText.length);
                                let oCMLength = 0;
                                oCM = myJSON.parse(xhttp.responseText);
                                switch (checkTDAPIError(oCM)) {
                                    case 0: //no error
                                        {
                                            try {
                                                oCMLength = oCM.candles.length;
                                            } catch (e2) {
                                                oCMLength = 0;
                                                bErrorGettingData = true;
                                            }
                                            break;
                                        }
                                    case 1: //acces code expired
                                        {
                                            xhttp = null;
                                            if (GetAccessCodeUsingRefreshToken()) {
                                                oCMLength = 0;
                                                bErrorGettingData = true;
                                            } else {
                                                alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                                gbDoingStockPriceHistory = false;
                                                gbGettingStockPriceHistory = false;
                                                SetDefault();
                                                return;
                                            }
                                            break;
                                        }
                                    case 2: //other error
                                        {
                                            if (oCM.error.toUpperCase() == "BAD REQUEST.") {
                                                alert("Make sure the Start Date is a valid trading day and then try again.");
                                                gbDoingStockPriceHistory = false;
                                                gbGettingStockPriceHistory = false;
                                                SetDefault();
                                                return;
                                            } else {
                                                oCMLength = 0;
                                                bErrorGettingData = true;
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            oCMLength = 0;
                                            bErrorGettingData = true;
                                            break;
                                        }
                                }

                                if (oCMLength > 0) {
                                    bOk = true;
                                    let sPriceMinute = "";
                                    if (gbUseLastTradingDay) {
                                        sStartDateLong = oCM.candles[oCM.candles.length - 1].datetime - (dLongTime * 60000);
                                        sStartDateShort = oCM.candles[oCM.candles.length - 1].datetime - (dShortTime * 60000);
                                    } else if ((dDate - (dLongTime * 60000)) > oCM.candles[oCM.candles.length - 1].datetime) {
                                        sStartDateLong = oCM.candles[oCM.candles.length - 1].datetime - (dLongTime * 60000);
                                        sStartDateShort = oCM.candles[oCM.candles.length - 1].datetime - (dShortTime * 60000);
                                    }
                                    //if (gbUseLastTradingDay) {
                                    //    sStartDateLong = oCM.candles[oCM.candles.length - 1].datetime - ((dLongTime - 1) * 60000);
                                    //    sStartDateShort = oCM.candles[oCM.candles.length - 1].datetime - ((dShortTime - 1) * 60000);
                                    //} else if ((dDate - (dLongTime * 60000)) > oCM.candles[oCM.candles.length - 1].datetime) {
                                    //    sStartDateLong = oCM.candles[oCM.candles.length - 1].datetime - ((dLongTime - 1) * 60000);
                                    //    sStartDateShort = oCM.candles[oCM.candles.length - 1].datetime - ((dShortTime - 1) * 60000);
                                    //}
                                    for (idxCandle = 0; idxCandle < oCM.candles.length; idxCandle++) {
                                        oPriceLast.totalVolume = oPriceLast.totalVolume + oCM.candles[idxCandle].volume;
                                    }
                                    let iStartIdx = 0;
                                    if ((dLongTime + 5) < oCM.candles.length) {
                                        iStartIdx = oCM.candles.length - dLongTime - 5;
                                    } else {
                                        iStartIdx = 0;
                                    }
                                    //                                        for (idxCandle = iStartIdx; idxCandle < oCM.candles.length; idxCandle++) {
                                    for (idxCandle = oCM.candles.length - 1; idxCandle > iStartIdx - 1; idxCandle = idxCandle - 1) {
                                        let sDetailBackgroundColor = "";
                                        let sDetailColor = "";
                                        if (oCM.candles[idxCandle].datetime >= sStartDateLong) {
                                            if (gbCollectDetail) {
                                                sTmp = FormatDateWithTime(new Date(oCM.candles[idxCandle].datetime), false, false);
                                                sPriceMinute = sPriceMinute + "<tr>";
                                                if (oCM.candles[idxCandle].datetime >= sStartDateShort) {
                                                    sDetailColor = "black";
                                                    sDetailBackgroundColor = "lightsalmon";
                                                } else {
                                                    sDetailColor = "black";
                                                    sDetailBackgroundColor = skBackgroundColorNotSpecial;
                                                }

                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 20%; text-align: " + sTextAlign + "; vertical-align: top; border-width:0px; \">" + sTmp + "</td>";

                                                sTmp = FormatMoney(oCM.candles[idxCandle].high);
                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 16%; text-align:" + sTextAlign + "; vertical-align: top; border-width: 0px; \">" + sTmp + "</td>";

                                                sTmp = FormatMoney(oCM.candles[idxCandle].low);
                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 16%; text-align:" + sTextAlign + "; vertical-align: top; border-width: 0px; \">" + sTmp + "</td>";

                                                sTmp = FormatInt(oCM.candles[idxCandle].volume);
                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 16%; text-align:" + sTextAlign + "; vertical-align: top; border-width: 0px; \">" + sTmp + "</td>";

                                                sTmp = FormatMoney(oCM.candles[idxCandle].open);
                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 16%; text-align:" + sTextAlign + "; vertical-align: top; border-width: 0px; \">" + sTmp + "</td>";

                                                sTmp = FormatMoney(oCM.candles[idxCandle].close);
                                                sPriceMinute = sPriceMinute + "<td style=\"background-color:" + sDetailBackgroundColor + "; color:" + sDetailColor + "; width: 16%; text-align:" + sTextAlign + "; vertical-align: top; border-width: 0px; \">" + sTmp + "</td>";
                                                sPriceMinute = sPriceMinute + "</tr>";
                                            }

                                            oPriceLastLong.count++;
                                            oPriceLastLong.highTotal = oPriceLastLong.highTotal + oCM.candles[idxCandle].high;
                                            oPriceLastLong.lowTotal = oPriceLastLong.lowTotal + oCM.candles[idxCandle].low;
                                            oPriceLastLong.openTotal = oPriceLastLong.openTotal + oCM.candles[idxCandle].open;
                                            oPriceLastLong.closeTotal = oPriceLastLong.closeTotal + oCM.candles[idxCandle].close;
                                            oPriceLastLong.volume = oPriceLastLong.volume + oCM.candles[idxCandle].volume;
                                            if (oPriceLastLong.high < oCM.candles[idxCandle].high) {
                                                oPriceLastLong.high = oCM.candles[idxCandle].high
                                            }
                                            if (oPriceLastLong.low > oCM.candles[idxCandle].low) {
                                                oPriceLastLong.low = oCM.candles[idxCandle].low
                                            }
                                        }
                                        if (oCM.candles[idxCandle].datetime >= sStartDateShort) {

                                            oPriceLastShort.count++;
                                            oPriceLastShort.highTotal = oPriceLastShort.highTotal + oCM.candles[idxCandle].high;
                                            oPriceLastShort.lowTotal = oPriceLastShort.lowTotal + oCM.candles[idxCandle].low;
                                            oPriceLastShort.openTotal = oPriceLastShort.openTotal + oCM.candles[idxCandle].open;
                                            oPriceLastShort.closeTotal = oPriceLastShort.closeTotal + oCM.candles[idxCandle].close;
                                            oPriceLastShort.volume = oPriceLastShort.volume + oCM.candles[idxCandle].volume;
                                            if (oPriceLastShort.high < oCM.candles[idxCandle].high) {
                                                oPriceLastShort.high = oCM.candles[idxCandle].high;
                                            }
                                            if (oPriceLastShort.low > oCM.candles[idxCandle].low) {
                                                oPriceLastShort.low = oCM.candles[idxCandle].low;
                                            }
                                        }

                                    }
                                    gPriceInfo[gPriceInfo.length] = oPriceLast;
                                    gPriceInfo[gPriceInfo.length - 1].idx = gPriceInfo.length - 1;

                                    if (gbCollectDetail) {
                                        gPriceMinutes[gPriceMinutes.length] = sPriceMinute;

                                        if (document.getElementById("miscname").innerHTML != "") {
                                            if (document.getElementById("miscname").innerHTML.indexOf(gPriceInfo[gPriceInfo.length - 1].symbol) != -1) {
                                                DoShowPriceHistoryDetail(gPriceInfo.length - 1, gPriceMinutes.length - 1, false);
                                            }
                                        }
                                    }

                                }

                                iTryCount = 2;
                            }
                            else {
                                iTryCount++;
                                if (iTryCount < 2) {
                                    xhttp = null;
                                }
                                else {
                                    //alert ("GetStockPriceHistory Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                                    bErrorGettingData = true;
                                    bOk = false;
                                }
                            }
                        }
                        else {
                            iTryCount++;
                            if (iTryCount < 2) {
                                xhttp = null;
                            }
                            else {
                                //alert ("GetStockPriceHistory Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                                bErrorGettingData = true;
                                bOk = false;
                            }
                        }
                    }
                    catch (e1) {
                        //debugger
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //                                alert("GetStockPriceHistory Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                            bErrorGettingData = true;
                            bOk = false;
                        }
                    }
                }
                else {
                    bErrorGettingData = true;
                    bOk = false;
                    break;
                }
            }
        }

    }
    if (bOk) {
        if (gPriceInfo.length > 0) {

            gPriceInfo.sort(sortByChgShortValue);

            let iPwdFormHeight = document.getElementById("pwdForm").clientHeight + 10;
            document.getElementById("tblSymbols").style.top = iPwdFormHeight.toString() + "px";
            document.getElementById("tblSymbols").style.left = "0px";

            document.getElementById("tblSymbols").style.width = "800px";
            document.getElementById("nameTitle").style.width = "780px";
            document.getElementById("tblSymbols").style.visibility = "visible";
            if (document.getElementById("miscname").innerHTML == "") {
                document.getElementById("tblDetail").style.visibility = "hidden";
            }
            //document.getElementById("tblDetail").style.width = "800px";
            //document.getElementById("tblDetail").style.left = "810px";
            //document.getElementById("tblDetail").style.top = iPwdFormHeight.toString() + "px";
            //if (gbCollectDetail) {
            //    document.getElementById("tblDetail").style.visibility = "visible";
            //} else {
            //    document.getElementById("tblDetail").style.visibility = "hidden";
            //}

            document.getElementById("nameTitle").innerHTML = "Symbol Price History";
            document.getElementById("nameID").style.fontSize = "14pt";
            let s = "<table style=\"width:100%;border-width:0px;border-collapse: collapse;\">";
            let oSymbolPrice = new SymbolPrice();
            let sTmp = "";
            let bFirstTime = true;


            let sTableColumnBorderRight = "border-right: 1px solid black;"
            let sTableColumnNoBorder = "border-width: 0px;"
            let sTableColumnBorderBottom = "border-bottom: 1px solid black;"
            for (let idxPriceInfo = 0; idxPriceInfo < gPriceInfo.length; idxPriceInfo++) {
                oSymbolPrice = new SymbolPrice();
                oPriceLastLong = gPriceInfo[idxPriceInfo].longPIP;
                oPriceLastShort = gPriceInfo[idxPriceInfo].shortPIP;

                if (bFirstTime) {
                    bFirstTime = false;
                    s = s + "<tr>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + "; vertical-align:top;" + sTableColumnBorderRight + sTableColumnBorderBottom + " \"><I>Symbol</I></th>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnBorderRight + sTableColumnBorderBottom + "\"><I>Current</I></th>";
                    s = s + "<th style=\"width:8%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnNoBorder + sTableColumnBorderBottom + "\"><I>" + dShortTime.toString() + " Chg</I ></th > ";
                    s = s + "<th style=\"width:8%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnBorderRight + sTableColumnBorderBottom + "\"><I>" + dLongTime.toString() + " Chg</I></th>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnNoBorder + sTableColumnBorderBottom + "\"><I>" + dShortTime.toString() + " High</I></th>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnBorderRight + sTableColumnBorderBottom + "\"><I>" + dShortTime.toString() + " Low</I></th>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnNoBorder + sTableColumnBorderBottom + "\"><I>" + dLongTime.toString() + " High</I></th>";
                    s = s + "<th style=\"width:10%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnBorderRight + sTableColumnBorderBottom + "\"><I>" + dLongTime.toString() + " Low</I></th>";
                    s = s + "<th style=\"width:12%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnNoBorder + sTableColumnBorderBottom + "\"><I>" + dShortTime.toString() + " Vol</I></th>";
                    s = s + "<th style=\"width:12%; text-align:" + sTextAlignHeader + ";vertical-align:top;" + sTableColumnNoBorder + sTableColumnBorderBottom + "\"><I>" + dLongTime.toString() + " Vol</I></th>";
                    s = s + "</tr>";
                }

                s = s + "<tr>";

                if (gbCollectDetail) {
                    s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnBorderRight + "\"><a href =\"JavaScript: DoShowPriceHistory(" + idxPriceInfo.toString() + "," + (gPriceInfo[idxPriceInfo].idx).toString() + ")\">" + gPriceInfo[idxPriceInfo].symbol + "</td>";
                } else {
                    s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnBorderRight + "\"><b>" + gPriceInfo[idxPriceInfo].symbol + "</b></td>";
                }

                oSymbolPrice = GetCurrentPrice(gPriceInfo[idxPriceInfo].symbol);

                let sBackgroundColor = "";
                let sBackgroundColorShort = "";
                let sBackgroundColorLong = "";
                let sTextColor = "";
                let sTextColorShort = "";
                let sTextColorLong = "";
                switch (SetSpecialPriceColor((oPriceLastShort.high - oPriceLastShort.low), (oPriceLastLong.high - oPriceLastLong.low), oSymbolPrice.price)) {
                    case 0: //not special
                        {
                            sBackgroundColor = skBackgroundColorNotSpecial;
                            sBackgroundColorShort = skBackgroundColorNotSpecial;
                            sBackgroundColorLong = skBackgroundColorNotSpecial;
                            sTextColor = skTextColorNotSpecial;
                            sTextColorShort = skTextColorNotSpecial;
                            sTextColorLong = skTextColorNotSpecial;
                            break;
                        }
                    case 1: //special short
                        {
                            sBackgroundColor = skBackgroundColorShort;
                            sBackgroundColorShort = skBackgroundColorShort;
                            sBackgroundColorLong = skBackgroundColorNotSpecial;
                            sTextColor = skTextColorShort;
                            sTextColorShort = skTextColorShort;
                            sTextColorLong = skTextColorNotSpecial;
                            break;
                        }
                    case 2: //special long
                        {
                            sBackgroundColor = skBackgroundColorLong;
                            sBackgroundColorShort = skBackgroundColorNotSpecial;
                            sBackgroundColorLong = skBackgroundColorLong;
                            sTextColor = skTextColorLong;
                            sTextColorShort = skTextColorNotSpecial;
                            sTextColorLong = skTextColorLong;
                            break;
                        }
                    case 3: //special short and long
                        {
                            sBackgroundColor = skBackgroundColorShort;
                            sBackgroundColorShort = skBackgroundColorShort;
                            sBackgroundColorLong = skBackgroundColorLong;
                            sTextColor = skTextColorShort;
                            sTextColorShort = skTextColorShort;
                            sTextColorLong = skTextColorLong;
                            break;
                        }
                }


                sTmp = FormatMoney(oSymbolPrice.price);
                s = s + "<td style=\"background-color:" + sBackgroundColor + "; color:" + sTextColor + "; width: 10%; text-align:" + sTextAlign + "; vertical-align: top;" + sTableColumnBorderRight + " \"><b>" + sTmp + "</b></td>";

                sTmp = FormatMoney(oPriceLastShort.high - oPriceLastShort.low);
                s = s + "<td style=\"background-color:" + sBackgroundColorShort + "; color:" + sTextColorShort + "; width:8%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnNoBorder + "\">" + sTmp + "</td>";
                sTmp = FormatMoney(oPriceLastLong.high - oPriceLastLong.low);
                s = s + "<td style=\"background-color:" + sBackgroundColorLong + "; color:" + sTextColorLong + "; width:8%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnBorderRight + "\">" + sTmp + "</td>";

                sTmp = FormatMoney(oPriceLastShort.high);
                s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnNoBorder + "\">" + sTmp + "</td>";
                sTmp = FormatMoney(oPriceLastShort.low);
                s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnBorderRight + "\">" + sTmp + "</td>";

                sTmp = FormatMoney(oPriceLastLong.high);
                s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnNoBorder + "\">" + sTmp + "</td>";
                sTmp = FormatMoney(oPriceLastLong.low);
                s = s + "<td style=\"width:10%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnBorderRight + "\">" + sTmp + "</td>";

                sTmp = FormatInt(oPriceLastShort.volume);
                s = s + "<td style=\"width:12%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnNoBorder + "\">" + sTmp + "</td>";
                sTmp = FormatInt(oPriceLastLong.volume);
                s = s + "<td style=\"width:12%; text-align:" + sTextAlign + ";vertical-align:top;" + sTableColumnNoBorder + "\">" + sTmp + "</td>";

                s = s + "</tr>";
            }
            s = s + "</table>";
            document.getElementById("name").innerHTML = s;
        }
        SetDefault();
        if (gbDoingStockPriceHistory) {
            gbGettingStockPriceHistory = false;
            document.getElementById("spanRunning").style.backgroundColor = "green";
            document.getElementById("spanRunning").style.Color = "white";
            window.setTimeout("GetStockPriceHistory()", 2000);
        }
    } else if (bErrorGettingData) {
        gbGettingStockPriceHistory = false;
        document.getElementById("spanRunning").style.backgroundColor = "red";
        document.getElementById("spanRunning").style.Color = "black";
        window.setTimeout("GetStockPriceHistory()", 2000);
    } else {
        gbGettingStockPriceHistory = false;
        gbDoingStockPriceHistory = false;
        SetDefault();
    }
}

function GetTDData(bFirstTime) {
    let iReturn = 0;
    let bOkToContinue = true;
    gbDoingGetTDData = true;
    giGetTDDataTimeoutId = 0;
    if (!gbDoingGetTrades && !gbDoingStockPriceHistory && !gbDoingDrag && !gbDoingCreateOrders) {
        if (IsMarketOpenForTrading(bFirstTime)) {
            giCurrentRefreshRate = giMarketOpenRefreshRate;
        } else {
            giCurrentRefreshRate = giMarketClosedRefreshRate;
        }
        if ((FormatCurrentDateForTD() == "2022-02-14") && (gsLogonUser == "pan3386") && (!gbUsingCell)) {
            if (document.getElementById("spanSpecialImage").style.display == "none") {
                document.getElementById("spanSpecialImage").style.display = "block";
            }
        } else {
            document.getElementById("spanSpecialImage").style.display = "none";
        }
        if (isUndefined(mySock)) {
            giCurrentRefreshRate = giMarketOpenRefreshRate;
        } else {
            if (isUndefined(mySock.readyState)) {
                giCurrentRefreshRate = giMarketOpenRefreshRate;
            } else {
                if ((mySock.readyState == 1) || (mySock.readyState == 0)) {
                    giCurrentRefreshRate = giMarketOpenRefreshRate;
                }
            }
        }
        if (bFirstTime) {
            //get account user principal data
            iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/userprincipals?fields=streamerSubscriptionKeys,streamerConnectionInfo", 1);
            if (iReturn == 0) {
                GetAccounts();
                if (gAccounts.length > 0) {
                    OpenSocket();
                    iReturn - GetTDDataHTTP("https://api.tdameritrade.com/v1/accounts?fields=positions", 2);
                    if (iReturn == 0) {
                        GetAccountsDetails();
                    }
                }
                iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/accounts/watchlists", 3);
                if (iReturn == 0) {
                    GetWatchlists(false);
                    if (gAccounts.length > 0) {
                        if (gWatchlists.length > 0) {
                            SetupWatchlists(false);
                        }
                    }

                } else {
                    bOkToContinue = false;
                }
            } else {
                bOkToContinue = false;
            }
        }

        if (gbDoResetWatchlists) {
            gbDoResetWatchlists = false;
            if (gAccounts.length > 0) {
                iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/accounts/watchlists", 3);
                if (iReturn == 0) {
                    GetWatchlists(true);
                    document.getElementById("spanWL").style.top = "40px";
                    document.getElementById("spanWL").style.left = "800px";
                } else {
                    bOkToContinue = false;
                }
            }
            SetDefault();
        }

        if (bOkToContinue) {
            //determine which symbols need quotes for indexes
            SetupIndexes(); //gsMarketsLastIndexes contains index symbols as symbol/desc,symbol/desc...
            let sSymbolsThatNeedQuotes = "";
            let sSep = "";
            if (gMarketIndexes.length > 0) {
                for (let idx = 0; idx < gMarketIndexes.length; idx++) {
                    sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + gMarketIndexes[idx].symbol.toUpperCase();
                    sSep = ",";
                }
            }
            //let sMarketsToTrack = gsMarketsLastIndexes.split(",");
            //if (sMarketsToTrack.length > 0) {
            //    for (let idx = 0; idx < sMarketsToTrack.length; idx++) {
            //        let sMarket = sMarketsToTrack[idx].split("/");
            //        if (sMarket.length > 0) {
            //            sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + sMarket[0].toUpperCase();
            //            sSep = ",";
            //        }
            //    }
            //}
            //determine which symbols need quotes for watchlists
            if (gWatchlists.length > 0) {
                //get account position data
                if (bFirstTime) {
                    for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                                sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                                sSep = ",";
                            }
                        }
                    }
                } else {
                    iReturn - GetTDDataHTTP("https://api.tdameritrade.com/v1/accounts?fields=positions", 2);
                    if (iReturn == 0) {
                        GetAccountsDetails();
                        for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                                if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                                    sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                                    sSep = ",";
                                }
                            }
                        }
                        //for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                        //    if (gWatchlists[idxWL].bSelected) {
                        //        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                        //            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                        //                sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                        //                sSep = ",";
                        //            }
                        //        }
                        //    }
                        //}
                    } else {
                        bOkToContinue = false;
                    }
                }
            }
            if (bOkToContinue) {
                sSymbolsThatNeedQuotes = GetUniqueListOfSymbols(sSymbolsThatNeedQuotes);
                if (!isUndefined(mySock.readyState)) {
                    if (mySock.readyState == 1) { //is the socket open - it could be closed if someone else logged on to the account or just not opened yet
                        if (gbLoggedIn) {
                            //get the new symbols - don't care about the ones that have been removed
                            let bDoGetQuotes = false;
                            if (gsSysmbolsThatNeedQuotes != "") {
                                if (gsSysmbolsThatNeedQuotes == sSymbolsThatNeedQuotes) {
                                    sSymbolsThatNeedQuotes = "";
                                } else {
                                    let vTmp = sSymbolsThatNeedQuotes.split(",");
                                    let sSep = "";
                                    let sTmp = "," + gsSysmbolsThatNeedQuotes + ",";
                                    sSymbolsThatNeedQuotes = "";
                                    for (let idxSymbol = 0; idxSymbol < vTmp.length; idxSymbol++) {
                                        if (sTmp.indexOf("," + vTmp[idxSymbol] + ",") == -1) {
                                            sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes + sSep + vTmp[idxSymbol];
                                            sSep = ",";
                                        }
                                    }
                                    if (sSymbolsThatNeedQuotes != "") {
                                        gsSysmbolsThatNeedQuotes = gsSysmbolsThatNeedQuotes + "," + sSymbolsThatNeedQuotes;
                                        sSymbolsThatNeedQuotes = gsSysmbolsThatNeedQuotes;
                                    }
                                }
                            } else {
                                gsSysmbolsThatNeedQuotes = sSymbolsThatNeedQuotes;
                                bDoGetQuotes = true;
                            }
                            if (sSymbolsThatNeedQuotes.length > 0) {
                                if (bDoGetQuotes) {
                                    iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/marketdata/quotes?&symbol=" + DoURLEncode(sSymbolsThatNeedQuotes), 4);
                                    if (iReturn != 0) {
                                        bOkToContinue = false;
                                    }
                                }
                                if (bOkToContinue) {
                                    let gQuoteRequest = "";
                                    if (("," + sSymbolsThatNeedQuotes + ",").indexOf(gsMarketsOilGasActual) != -1) {
                                        if (sSymbolsThatNeedQuotes != gsMarketsOilGasActual) {
                                            sSymbolsThatNeedQuotes = sSymbolsThatNeedQuotes.replace(gsMarketsOilGasActual + ",", "");
                                            giRequestId++;
                                            gQuoteRequest = {
                                                "requests": [
                                                    {
                                                        "service": "QUOTE",
                                                        "requestid": giRequestId.toString(),
                                                        "command": "SUBS",
                                                        "account": oACCP.accounts[0].accountId,
                                                        "source": oACCP.streamerInfo.appId,
                                                        "parameters": {
                                                            "keys": sSymbolsThatNeedQuotes,
                                                            "fields": "0,1,2,3,4,5,6,7,8,9,12,13,15,16,17,18,24,26,27,28,29,30,31,32,33,34,39,40,43,44,47,48,49,50,51,52"
                                                        }
                                                    },
                                                    {
                                                        "service": "LEVELONE_FUTURES",
                                                        "requestid": (giRequestId + 1).toString(),
                                                        "command": "SUBS",
                                                        "account": oACCP.accounts[0].accountId,
                                                        "source": oACCP.streamerInfo.appId,
                                                        "parameters": {
                                                            "keys": gsMarketsOilGasActual,
                                                            "fields": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35"
                                                        }
                                                    }
                                                ]
                                            }
                                            giRequestId++;
                                        } else {
                                            giRequestId++;
                                            gQuoteRequest = {
                                                "requests": [
                                                    {
                                                        "service": "LEVELONE_FUTURES",
                                                        "requestid": giRequestId.toString(),
                                                        "command": "SUBS",
                                                        "account": oACCP.accounts[0].accountId,
                                                        "source": oACCP.streamerInfo.appId,
                                                        "parameters": {
                                                            "keys": gsMarketsOilGasActual,
                                                            "fields": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    } else {
                                        giRequestId++;
                                        gQuoteRequest = {
                                            "requests": [
                                                {
                                                    "service": "QUOTE",
                                                    "requestid": giRequestId.toString(),
                                                    "command": "SUBS",
                                                    "account": oACCP.accounts[0].accountId,
                                                    "source": oACCP.streamerInfo.appId,
                                                    "parameters": {
                                                        "keys": sSymbolsThatNeedQuotes,
                                                        "fields": "0,1,2,3,4,5,6,7,8,9,12,13,15,16,17,18,24,26,27,28,29,30,31,32,33,34,39,40,43,44,47,48,49,50,51,52"
                                                    }
                                                }
                                            ]
                                        }
                                    }

                                    mySock.send(myJSON.stringify(gQuoteRequest));
                                }
                            }
                            GetWatchlistPrices();
                            GetIndexValues();
                            GetWatchlistSO();
                            GetWatchlistSummary();
                        }

                    } else if (mySock.readyState == 3) { //socket is closed or couldn't be opened
                        //use http to get quotes
                        //get the new symbols - don't care about the ones that have been removed
                        gsSysmbolsThatNeedQuotes = sSymbolsThatNeedQuotes;
                        if (sSymbolsThatNeedQuotes.length > 0) {
                            iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/marketdata/quotes?&symbol=" + DoURLEncode(sSymbolsThatNeedQuotes), 4);
                            if (iReturn == 0) {
                                GetWatchlistPrices();
                                GetIndexValues();
                                GetWatchlistSO();
                                GetWatchlistSummary();
                            } else {
                                bOkToContinue = false;
                            }
                        }
                    }
                }
            }
        }
    }
    giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", giCurrentRefreshRate);
    gbDoingGetTDData = false;
}

function GetTDDataHTTP(sServerURL, oCMindex) {
    let iTryCount = 0;
    let iReturn = 0;

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------

        let xhttp = null;
        let iInnerTryCount = 0;
        let bBadoCMIndex = false;
        let iCheckTDAPIReturn = 0;
        let sAPIError = "";
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenGet(xhttp, sServerURL, "Error during xhttp.open to " + sServerURL, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

            // send the request
            try {
                //debugger
                xhttp.send();
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {

                        switch (oCMindex) {
                            case 0: //returns oCMTemp
                                {
                                    oCMTemp = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oCMTemp);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oCMTemp.error))) {
                                            sAPIError = oCMTemp.error;
                                        }
                                    }
                                    break;
                                }
                            case 1: //account principals
                                {
                                    oACCP = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oACCP);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oACCP.error))) {
                                            sAPIError = oACCP.error;
                                        }
                                    }
                                    break;
                                }
                            case 2: //account positions
                                {
                                    oACC = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oACC);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oACC.error))) {
                                            sAPIError = oACC.error;
                                        }
                                    }
                                    break;
                                }
                            case 3: //account watchlists
                                {
                                    oCMWL = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oCMWL);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oCMWL.error))) {
                                            sAPIError = oCMWL.error;
                                        }
                                    }
                                    break;
                                }
                            case 4: //market data quotes
                                {
                                    oMDQ = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oMDQ);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oMDQ.error))) {
                                            sAPIError = oMDQ.error;
                                        }
                                    }
                                    break;
                                }
                            case 5: //saved orders
                                {
                                    oCMSavedOrders = myJSON.parse(xhttp.responseText);
                                    iCheckTDAPIReturn = checkTDAPIError(oCMSavedOrders);
                                    if (iCheckTDAPIReturn != 0) {
                                        if (!(isUndefined(oCMSavedOrders.error))) {
                                            sAPIError = oCMSavedOrders.error;
                                        }
                                    }
                                    break;
                                }
                            default:
                                {
                                    bBadoCMIndex = true;
                                    break;
                                }
                        }
                        if (!bBadoCMIndex) {
                            switch (iCheckTDAPIReturn) {
                                case 0: //no error
                                    {
                                        iReturn = 0;
                                        gsLastError = "";
                                        iTryCount = 2;
                                        break;
                                    }
                                case 1: //acces code expired
                                    {
                                        xhttp = null;
                                        if (GetAccessCodeUsingRefreshToken()) {
                                            iTryCount++;
                                        } else {
                                            iReturn = 1;
                                            gsLastError = "Access code expired. Refresh failed."
                                            iTryCount = 2;
                                        }
                                        break;
                                    }
                                case 2: //other error
                                    {
                                        if (sAPIError.toUpperCase() == "BAD REQUEST.") {
                                            iReturn = 21;
                                            gsLastError = "Invalid search arguments.";
                                        } else {
                                            iReturn = 2;
                                            gsLastError = sAPIError;
                                        }
                                        iTryCount = 2;
                                        break;
                                    }
                                default:
                                    {
                                        iReturn = 3;
                                        gsLastError = "Unknown error.";
                                        iTryCount = 2;
                                        break;
                                    }
                            }
                        } else {
                            iReturn = 8;
                            gsLastError = "Bad oCM Index."
                            iTryCount = 2;
                        }
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            iReturn = 4;
                            gsLastError = "HTTP response is blank.";
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        iReturn = 5;
                        gsLastError = "HTTP response is null.";
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    //alert("GetIndexValues Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                    iReturn = 6;
                    gsLastError = e1.message;
                }
            }
        }
        else {
            iReturn = 7; //error during HTTP open request
            gsLastError = "Error during HTTP open request";
            iTryCount = 2;
            break;
        }
    }

    return iReturn;
}

function GetTradeFees(oCM, idxTrade) {
    let dFees = 0.0;
    //"fees": {
    //    "rFee": 0,
    //    "additionalFee": 0,
    //    "cdscFee": 0,
    //    "regFee": 0,
    //    "otherCharges": 0,
    //    "commission": 0,
    //    "optRegFee": 0,
    //    "secFee": 0
    //},
    if (!isUndefined(oCM[idxTrade].fees)) {
        if (!isUndefined(oCM[idxTrade].fees.rFee)) {
            dFees = dFees + oCM[idxTrade].fees.rFee;
        }
        if (!isUndefined(oCM[idxTrade].fees.additionalFee)) {
            dFees = dFees + oCM[idxTrade].fees.additionalFee;
        }
        if (!isUndefined(oCM[idxTrade].fees.cdscFee)) {
            dFees = dFees + oCM[idxTrade].fees.cdscFee;
        }
        if (!isUndefined(oCM[idxTrade].fees.regFee)) {
            dFees = dFees + oCM[idxTrade].fees.regFee;
        }
        if (!isUndefined(oCM[idxTrade].fees.otherCharges)) {
            dFees = dFees + oCM[idxTrade].fees.otherCharges;
        }
        if (!isUndefined(oCM[idxTrade].fees.commission)) {
            dFees = dFees + oCM[idxTrade].fees.commission;
        }
        if (!isUndefined(oCM[idxTrade].fees.optRegFee)) {
            dFees = dFees + oCM[idxTrade].fees.optRegFee;
        }
    //    if (!isUndefined(oCM[idxTrade].fees.secFee)) {
    //        dFees = dFees + oCM[idxTrade].fees.secFee;
    //    }
    }
    return dFees;
}

function GetTrades(bFirstTime) {
    let iTryCount = 0;
    let vTmp = null;
    let sTmp = "";
    let bNeedToAddSymbol = false;
    let bOk = true;

    let sBodyTextAlign = "center";
    let sHeadingTextAlign = "center";
    let sTotalsBackcolor = "#99CCFF";
    let sTotalsColorGain = "green";
    let sTotalsColorLoss = gsNegativeColor;


    //debugger
    let sServerUrlBase = "https://api.tdameritrade.com/v1/accounts/xxxxx/transactions?symbol=aaaaaaa&startDate=yyyyy&endDate=zzzzz";
    let sServerUrlBaseAllSymbols = "https://api.tdameritrade.com/v1/accounts/xxxxx/transactions?startDate=yyyyy&endDate=zzzzz";
    //        let sServerUrlBase = "https://api.tdameritrade.com/v1/accounts/xxxxx/transactions?type=TRADE&symbol=aaaaaaa&startDate=yyyyy&endDate=zzzzz";
    //        let sServerUrlBaseAllSymbols = "https://api.tdameritrade.com/v1/accounts/xxxxx/transactions?type=TRADE&startDate=yyyyy&endDate=zzzzz";
    let sStartDate = "";
    let sEndDate = "";

    let sSymbolToLookup = "";
    let sSymbolsToLookupTmp = TrimLikeVB(document.getElementById("txtSymbols").value);

    let oCM;
    let sSymbolsToLookup = "";
    let sSymbolsToLookupServer = "";

    let bEndDateISTodaysDate = false;
    let idxDatesStart = 0;
    let bDoneGettingSymbolData = false;
    let idxStart = 0;


    if (bFirstTime) {
        gbDoingGetTrades = true;
        gGetTradesContext = new GetTradesContext();
        setCookie(gsMarketCookieName, SetCurrentCookie(), 30);

        if (sSymbolsToLookupTmp == "") {
            sSymbolsToLookup = "ALLSYMBOLS"; //set to this if nothing entered or more than one symbol entered
            sSymbolsToLookupServer = "ALLSYMBOLS";
        } else {
            sSymbolsToLookupTmp = GetUniqueListOfSymbols(sSymbolsToLookupTmp); //1/19/21
            vTmp = sSymbolsToLookupTmp.split(",");
            if (vTmp.length == 1) {
                sSymbolsToLookupServer = sSymbolsToLookupTmp.toUpperCase();
            } else {
                sSymbolsToLookupServer = "ALLSYMBOLS"; //set to this if nothing entered or more than one symbol entered
            }
            sSymbolsToLookup = "," + sSymbolsToLookupTmp.toUpperCase() + ",";
        }
        sStartDate = document.getElementById("txtStartDate").value;
        sEndDate = document.getElementById("txtEndDate").value;
        if (!ValidateTDDate(sStartDate) || !ValidateTDDate(sEndDate)) {
            GetTradesCanceled();
            return;
        }
        if (sEndDate < sStartDate) {
            alert("Invalid TD date. Please enter an end date greater than or equal to the start date.");
            GetTradesCanceled();
            return;
        }

        bEndDateISTodaysDate = BuildStartEndDates(sStartDate, sEndDate);

        gTrades.length = 0;
        gSymbols.length = 0;

        //        let sSymbolsToLookup = sSymbolsToLookupTmp.split(",")

        giProgress = 0;
        ShowProgress(true, false);
        idxDatesStart = gsStartDates.length - 1;

        let iAccountCnt = 0;
        for (let idx = 0; idx < gAccounts.length; idx++) {
            if (gAccounts[idx].CBliquidationValue >= 1000.0) {
                iAccountCnt++;
            }
        }

        gGetTradesContext.iProgressIncrement = 100 / (iAccountCnt * gsStartDates.length);

        //gGetTradesContext.iProgressIncrement = Math.floor(100 / (gAccounts.length * gsStartDates.length)) + 1;
        //if ((gGetTradesContext.iProgressIncrement * (gAccounts.length * gsStartDates.length)) > 120) {
        //    gGetTradesContext.iProgressIncrement = gGetTradesContext.iProgressIncrement - 1;
        //}

        idxStart = 0;
    } else {
        sServerUrlBase = gGetTradesContext.sServerUrlBase;
        sServerUrlBaseAllSymbols = gGetTradesContext.sServerUrlBaseAllSymbols;
        sStartDate = gGetTradesContext.sStartDate;
        sEndDate = gGetTradesContext.sEndDate;

        sSymbolToLookup = gGetTradesContext.sSymbolToLookup;
        sSymbolsToLookupTmp = gGetTradesContext.sSymbolsToLookupTmp;

        sSymbolsToLookup = gGetTradesContext.sSymbolsToLookup;
        sSymbolsToLookupServer = gGetTradesContext.sSymbolsToLookupServer;

        bEndDateISTodaysDate = gGetTradesContext.bEndDateISTodaysDate;
        idxDatesStart = gGetTradesContext.idxDatesStart;

        bOk = gGetTradesContext.bOk;
        bDoneGettingSymbolData = gGetTradesContext.bDoneGettingSymbolData;
        bNeedToAddSymbol = gGetTradesContext.bNeedToAddSymbol;
        idxStart = gGetTradesContext.idxStart;

    }

    for (let idxDates = idxDatesStart; idxDates > -1; idxDates--) {
        if (gbStopGetTrades) {
            GetTradesCanceled();
            return;
        }
        sStartDate = gsStartDates[idxDates];
        sEndDate = gsEndDates[idxDates];
        if (gAccounts.length > 0) {
            for (let idx = idxStart; idx < gAccounts.length; idx++) {
                if (gbStopGetTrades) {
                    GetTradesCanceled();
                    return;
                }
                //ignore accounts with less than $1000 liquidation value
                if (gAccounts[idx].CBliquidationValue >= 1000.0) {
                    if (giProgress < 100) {
                        giProgress = giProgress + gGetTradesContext.iProgressIncrement;
                    }
                    iTryCount = 0;
                    while (iTryCount < 2) {
                        let sServerUrl = "";
                        if (sSymbolsToLookupServer == "ALLSYMBOLS") {
                            sServerUrl = sServerUrlBaseAllSymbols.replace("xxxxx", gAccounts[idx].accountId);
                        } else {
                            sServerUrl = sServerUrlBase.replace("aaaaaaa", sSymbolsToLookupServer);
                            sServerUrl = sServerUrl.replace("xxxxx", gAccounts[idx].accountId);
                        }
                        sServerUrl = sServerUrl.replace("yyyyy", sStartDate);
                        sServerUrl = sServerUrl.replace("zzzzz", sEndDate);

                        let xhttp = null;
                        let iInnerTryCount = 0;
                        xhttp = oHTTP();
                        while ((xhttp == null) && (iInnerTryCount < 5)) {
                            xhttp = oHTTP();
                            iInnerTryCount = iInnerTryCount + 1;
                        }
                        iInnerTryCount = 0;
                        if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
                            // set the request header
                            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

                            // send the request
                            try {
                                //                                    debugger
                                xhttp.send();
                                if (xhttp.responseText != null) {
                                    if (xhttp.responseText != "") {
                                        //alert("GetTrades xhttp.responseText length = " + xhttp.responseText.length);

                                        let oCMLength = 0;
                                        oCM = myJSON.parse(xhttp.responseText);
                                        switch (checkTDAPIError(oCM)) {
                                            case 0: //no error
                                                {
                                                    try {
                                                        oCMLength = oCM.length;
                                                    } catch (e2) {
                                                        oCMLength = 0;
                                                    }
                                                    break;
                                                }
                                            case 1: //acces code expired
                                                {
                                                    xhttp = null;
                                                    if (GetAccessCodeUsingRefreshToken()) {
                                                        oCMLength = -1;
                                                    } else {
                                                        alert("An error occurred attempting to refresh the access code. Please logoff or reload the app.");
                                                        GetTradesCanceled();
                                                        return;
                                                    }
                                                    break;
                                                }
                                            case 2: //other error
                                                {
                                                    oCMLength = 0;
                                                    break;
                                                }
                                            default:
                                                {
                                                    oCMLength = 0;
                                                    break;
                                                }
                                        }

                                        if (oCMLength > 0) {
                                            let bUseTradeRS = false;
                                            let oTradeRS = new Trade();
                                            for (let idxTrade = 0; idxTrade < oCM.length; idxTrade++) {
                                                if (gbStopGetTrades) {
                                                    GetTradesCanceled();
                                                    return;
                                                }
                                                if (oCM[idxTrade].type == "DIVIDEND_OR_INTEREST") {
                                                    bUseTradeRS = false;
                                                    if (!isUndefined(oCM[idxTrade].transactionItem.instrument)) {
                                                        gAccounts[0].totalTrades++;

                                                        let oTrade = new Trade();
                                                        oTrade.accountId = gAccounts[idx].accountId;
                                                        oTrade.accountName = gAccounts[idx].accountName;
                                                        oTrade.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                        oTrade.date = oCM[idxTrade].transactionDate;
                                                        oTrade.amount = 0;
                                                        oTrade.price = 0;
                                                        oTrade.cost = 0;
                                                        oTrade.netAmount = oCM[idxTrade].netAmount;
                                                        if (isUndefined(oCM[idxTrade].transactionSubType)) {
                                                            oTrade.transactionSubType = "";
                                                        } else {
                                                            oTrade.transactionSubType = oCM[idxTrade].transactionSubType;
                                                        }
                                                        oTrade.fees = GetTradeFees(oCM, idxTrade); //get the fees associated with the trade
                                                        //gTrades[gTrades.length] = oTrade;

                                                        //now update the Symbols
                                                        if (!isUndefined(oCM[idxTrade].transactionItem)) {
                                                            if (!isUndefined(oCM[idxTrade].transactionItem.instrument)) {
                                                                if (!isUndefined(oCM[idxTrade].transactionItem.instrument.symbol)) {
                                                                    bNeedToAddSymbol = false;
                                                                    if ((sSymbolsToLookup.indexOf("," + oCM[idxTrade].transactionItem.instrument.symbol.toUpperCase() + ",") != -1) ||
                                                                        (sSymbolsToLookup == "ALLSYMBOLS")) {
                                                                        bNeedToAddSymbol = true;
                                                                        if (gSymbols.length > 0) {
                                                                            for (let idxTmp = 0; idxTmp < gSymbols.length; idxTmp++) {
                                                                                if ((gSymbols[idxTmp].symbol == oCM[idxTrade].transactionItem.instrument.symbol) &&
                                                                                    (gSymbols[idxTmp].accountId == gAccounts[idx].accountId)) {
                                                                                    bNeedToAddSymbol = false;
                                                                                    gSymbols[idxTmp].sell = gSymbols[idxTmp].sell + oCM[idxTrade].netAmount;
                                                                                    gSymbols[idxTmp].trades[gSymbols[idxTmp].trades.length] = oTrade;
                                                                                    gSymbols[idxTmp].fees = gSymbols[idxTmp].fees + oTrade.fees;
                                                                                    break;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    if (bNeedToAddSymbol) {
                                                                        let oSymbol = new Symbol();
                                                                        oSymbol.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                                        oSymbol.accountId = gAccounts[idx].accountId;
                                                                        oSymbol.accountName = gAccounts[idx].accountName;
                                                                        oSymbol.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                                        oSymbol.sell = oCM[idxTrade].netAmount;
                                                                        oSymbol.trades[oSymbol.trades.length] = oTrade;
                                                                        oSymbol.fees = oTrade.fees;
                                                                        gSymbols[gSymbols.length] = oSymbol;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else if (oCM[idxTrade].type == "RECEIVE_AND_DELIVER") {
                                                    if (!isUndefined(oCM[idxTrade].transactionItem)) {
                                                        if (!isUndefined(oCM[idxTrade].transactionItem.instrument)) {
                                                            if (!isUndefined(oCM[idxTrade].transactionSubType)) {
                                                                let bFoundSubType = false;
                                                                let oTrade = new Trade();
                                                                let sRADSymbol = "";
                                                                oTrade.transactionSubType = oCM[idxTrade].transactionSubType;
                                                                if (oCM[idxTrade].transactionSubType == "TI") {
                                                                    bUseTradeRS = false;
                                                                    //TRANSFER OF SECURITY OR OPTION IN
                                                                    oTrade.accountId = gAccounts[idx].accountId;
                                                                    oTrade.accountName = gAccounts[idx].accountName;
                                                                    oTrade.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                                    sRADSymbol = oTrade.symbol;
                                                                    oTrade.date = oCM[idxTrade].transactionDate;
                                                                    oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                                    oTrade.fees = GetTradeFees(oCM, idxTrade); //get the fees associated with the trade
                                                                    //need to get price on the transaction date
                                                                    let vTmp = oTrade.date.split("T"); //"2020-04-13T12:48:34+0000"
                                                                    if (gaFixedPrices.length > 0) {
                                                                        for (let idxFP = 0; idxFP < gaFixedPrices.length; idxFP++) {
                                                                            let oFP = new FixedPrice();
                                                                            oFP = gaFixedPrices[idxFP];
                                                                            if ((oFP.symbol == sRADSymbol.toUpperCase()) &&
                                                                                (oFP.date == vTmp[0])) {
                                                                                oTrade.price = oFP.price;
                                                                                oTrade.cost = -1 * (oTrade.price * oTrade.amount); //negative because a buy trade
                                                                                oTrade.netAmount = oTrade.cost;
                                                                                oTrade.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                                                bFoundSubType = true;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                } else if (oCM[idxTrade].transactionSubType == "RS") {
                                                                    //MANDATORY REVERSE SPLIT
                                                                    oTrade.accountId = gAccounts[idx].accountId;
                                                                    oTrade.accountName = gAccounts[idx].accountName;
                                                                    oTrade.date = oCM[idxTrade].transactionDate;
                                                                    oTrade.price = 0.0;
                                                                    oTrade.cost = 0.0;
                                                                    oTrade.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                                    oTrade.fees = GetTradeFees(oCM, idxTrade); //get the fees associated with the trade
                                                                    if (isUndefined(oCM[idxTrade].transactionItem.instrument.symbol)) {
                                                                        //decreasing number of shares - cost 0
                                                                        oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                                        oTrade.netAmount = 0.0;
                                                                        //need to lookup cusip to get symbol
                                                                        let iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/instruments?symbol=" + oCM[idxTrade].transactionItem.instrument.cusip + "&projection=symbol-search", 0);
                                                                        if (iReturn == 0) {
                                                                            if (!isUndefined(oCMTemp[oCM[idxTrade].transactionItem.instrument.cusip])) {
                                                                                oTrade.symbol = oCMTemp[oCM[idxTrade].transactionItem.instrument.cusip].symbol;
                                                                                sRADSymbol = oTrade.symbol;
                                                                                bFoundSubType = true;
                                                                                bUseTradeRS = false;
                                                                            } else {
                                                                                oTradeRS = new Trade();
                                                                                oTradeRS.accountId = oTrade.accountId
                                                                                oTradeRS.accountName = oTrade.accountName;
                                                                                oTradeRS.amount = oTrade.amount;
                                                                                oTradeRS.assetType = oTrade.assetType;
                                                                                oTradeRS.cost = oTrade.cost;
                                                                                oTradeRS.date = oTrade.date;
                                                                                oTradeRS.netAmount = oTrade.netAmount;
                                                                                oTradeRS.fees = oTrade.fees;
                                                                                oTradeRS.price = oTrade.price;
                                                                                oTradeRS.transactionSubType = oCM[idxTrade].transactionSubType;
                                                                                bUseTradeRS = true;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        //increasing number of shares - cost 0
                                                                        oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                                        oTrade.netAmount = -0.00001;
                                                                        oTrade.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                                        sRADSymbol = oTrade.symbol;
                                                                        bFoundSubType = true;
                                                                    }
                                                                } else {
                                                                    bUseTradeRS = false;
                                                                }

                                                                //if (oCM[idxTrade].transactionSubType == "RS") {
                                                                //    //MANDATORY REVERSE SPLIT
                                                                //    oTrade.accountId = gAccounts[idx].accountId;
                                                                //    oTrade.accountName = gAccounts[idx].accountName;
                                                                //    oTrade.date = oCM[idxTrade].transactionDate;
                                                                //    oTrade.price = 0.0;
                                                                //    oTrade.cost = 0.0;
                                                                //    oTrade.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                                //    if (isUndefined(oCM[idxTrade].transactionItem.instrument.symbol)) {
                                                                //        //decreasing number of shares - cost 0
                                                                //        oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                                //        oTrade.netAmount = 0.0;
                                                                //        //need to lookup cusip to get symbol
                                                                //        let iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/instruments?symbol=" + oCM[idxTrade].transactionItem.instrument.cusip + "&projection=symbol-search", 0);
                                                                //        if (iReturn == 0) {
                                                                //            if (!isUndefined(oCMTemp[oCM[idxTrade].transactionItem.instrument.cusip])) {
                                                                //                oTrade.symbol = oCMTemp[oCM[idxTrade].transactionItem.instrument.cusip].symbol;
                                                                //                sRADSymbol = oTrade.symbol;
                                                                //                bFoundSubType = true;
                                                                //            }
                                                                //        }
                                                                //    } else {
                                                                //        //increasing number of shares - cost 0
                                                                //        oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                                //        oTrade.netAmount = -0.00001;
                                                                //        oTrade.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                                //        sRADSymbol = oTrade.symbol;
                                                                //        bFoundSubType = true;
                                                                //    }
                                                                //}
                                                                if (bFoundSubType) {
                                                                    if (bUseTradeRS) {
                                                                        bUseTradeRS = false;
                                                                        oTradeRS.symbol = sRADSymbol;
                                                                        GetTradesAddSymbol(idx, sSymbolsToLookup, sRADSymbol, oTradeRS);
                                                                    }
                                                                    GetTradesAddSymbol(idx, sSymbolsToLookup, sRADSymbol, oTrade);
                                                                }
                                                            }
                                                        }
                                                    }

                                                } else if (oCM[idxTrade].type == "TRADE") {
                                                    bUseTradeRS = false;
                                                    gAccounts[0].totalTrades++;
                                                    let oTrade = new Trade();
                                                    oTrade.accountId = gAccounts[idx].accountId;
                                                    oTrade.accountName = gAccounts[idx].accountName;
                                                    oTrade.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                    oTrade.date = oCM[idxTrade].transactionDate;
                                                    oTrade.amount = oCM[idxTrade].transactionItem.amount;
                                                    oTrade.price = oCM[idxTrade].transactionItem.price;
                                                    oTrade.cost = oCM[idxTrade].transactionItem.cost;
                                                    oTrade.netAmount = oCM[idxTrade].netAmount;
                                                    oTrade.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                    if (isUndefined(oCM[idxTrade].transactionSubType)) {
                                                        oTrade.transactionSubType = "";
                                                    } else {
                                                        oTrade.transactionSubType = oCM[idxTrade].transactionSubType;
                                                    }
                                                    oTrade.fees = GetTradeFees(oCM, idxTrade); //get the fees associated with the trade
                                                    //gTrades[gTrades.length] = oTrade;

                                                    //now update the Symbols
                                                    if (!isUndefined(oCM[idxTrade].transactionItem)) {
                                                        if (!isUndefined(oCM[idxTrade].transactionItem.instrument)) {
                                                            if (!isUndefined(oCM[idxTrade].transactionItem.instrument.symbol)) {
                                                                bNeedToAddSymbol = false;
                                                                if ((sSymbolsToLookup.indexOf("," + oCM[idxTrade].transactionItem.instrument.symbol.toUpperCase() + ",") != -1) ||
                                                                    (sSymbolsToLookup == "ALLSYMBOLS")) {
                                                                    bNeedToAddSymbol = true;
                                                                    if (gSymbols.length > 0) {
                                                                        for (let idxTmp = 0; idxTmp < gSymbols.length; idxTmp++) {
                                                                            if ((gSymbols[idxTmp].symbol == oCM[idxTrade].transactionItem.instrument.symbol) &&
                                                                                (gSymbols[idxTmp].accountId == gAccounts[idx].accountId)) {
                                                                                bNeedToAddSymbol = false;
                                                                                if (oCM[idxTrade].netAmount < 0.0) {
                                                                                    //buy
                                                                                    gSymbols[idxTmp].shares = gSymbols[idxTmp].shares + oCM[idxTrade].transactionItem.amount;
                                                                                    gSymbols[idxTmp].buy = gSymbols[idxTmp].buy - oCM[idxTrade].netAmount;
                                                                                } else {
                                                                                    //sell
                                                                                    gSymbols[idxTmp].shares = gSymbols[idxTmp].shares - oCM[idxTrade].transactionItem.amount;
                                                                                    gSymbols[idxTmp].sell = gSymbols[idxTmp].sell + oCM[idxTrade].netAmount;
                                                                                }
                                                                                gSymbols[idxTmp].trades[gSymbols[idxTmp].trades.length] = oTrade;
                                                                                gSymbols[idxTmp].fees = gSymbols[idxTmp].fees + oTrade.fees;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                if (bNeedToAddSymbol) {
                                                                    let oSymbol = new Symbol();
                                                                    oSymbol.symbol = oCM[idxTrade].transactionItem.instrument.symbol;
                                                                    oSymbol.accountId = gAccounts[idx].accountId;
                                                                    oSymbol.accountName = gAccounts[idx].accountName;
                                                                    oSymbol.assetType = oCM[idxTrade].transactionItem.instrument.assetType;
                                                                    if (oCM[idxTrade].netAmount < 0.0) {
                                                                        //buy
                                                                        oSymbol.shares = oCM[idxTrade].transactionItem.amount;
                                                                        oSymbol.buy = -1 * oCM[idxTrade].netAmount;
                                                                    } else {
                                                                        //sell
                                                                        oSymbol.shares = -1 * oCM[idxTrade].transactionItem.amount;
                                                                        oSymbol.sell = oCM[idxTrade].netAmount;
                                                                    }
                                                                    oSymbol.trades[oSymbol.trades.length] = oTrade;
                                                                    oSymbol.fees = oTrade.fees;
                                                                    gSymbols[gSymbols.length] = oSymbol;
                                                                }

                                                            }
                                                        }
                                                    }
                                                } else {
                                                    bUseTradeRS = false;
                                                }
                                            }
                                        }
                                        if (oCMLength != -1) {
                                            iTryCount = 2;
                                        }
                                    }
                                    else {
                                        iTryCount++;
                                        if (iTryCount < 2) {
                                            xhttp = null;
                                        }
                                        else {
                                            //alert ("GetTrades Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                                        }
                                    }
                                }
                                else {
                                    iTryCount++;
                                    if (iTryCount < 2) {
                                        xhttp = null;
                                    }
                                    else {
                                        //alert ("GetTrades Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                                    }
                                }
                            }
                            catch (e1) {
                                //debugger
                                iTryCount++;
                                if (iTryCount < 2) {
                                    xhttp = null;
                                }
                                else {
                                    alert("GetTrades Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                                    bOk = false;
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                    gGetTradesContext.sServerUrlBase = sServerUrlBase;
                    gGetTradesContext.sServerUrlBaseAllSymbols = sServerUrlBaseAllSymbols;
                    gGetTradesContext.sStartDate = sStartDate;
                    gGetTradesContext.sEndDate = sEndDate;

                    gGetTradesContext.sSymbolToLookup = sSymbolToLookup;
                    gGetTradesContext.sSymbolsToLookupTmp = sSymbolsToLookupTmp;

                    gGetTradesContext.sSymbolsToLookup = sSymbolsToLookup;
                    gGetTradesContext.sSymbolsToLookupServer = sSymbolsToLookupServer;

                    gGetTradesContext.bEndDateISTodaysDate = bEndDateISTodaysDate;
                    gGetTradesContext.idxDatesStart = idxDates;

                    gGetTradesContext.bOk = bOk;
                    gGetTradesContext.bDoneGettingSymbolData = bDoneGettingSymbolData;
                    gGetTradesContext.bNeedToAddSymbol = bNeedToAddSymbol;
                    gGetTradesContext.idxStart = idx + 1;

                    window.setTimeout("GetTrades(false)", 100);
                    return;
                }
            }
        }

        if (!bOk) {
            break;
        }
        gGetTradesContext.sServerUrlBase = sServerUrlBase;
        gGetTradesContext.sServerUrlBaseAllSymbols = sServerUrlBaseAllSymbols;
        gGetTradesContext.sStartDate = sStartDate;
        gGetTradesContext.sEndDate = sEndDate;

        gGetTradesContext.sSymbolToLookup = sSymbolToLookup;
        gGetTradesContext.sSymbolsToLookupTmp = sSymbolsToLookupTmp;

        gGetTradesContext.sSymbolsToLookup = sSymbolsToLookup;
        gGetTradesContext.sSymbolsToLookupServer = sSymbolsToLookupServer;

        gGetTradesContext.bEndDateISTodaysDate = bEndDateISTodaysDate;
        gGetTradesContext.idxDatesStart = idxDates - 1;

        gGetTradesContext.bOk = bOk;
        gGetTradesContext.bDoneGettingSymbolData = bDoneGettingSymbolData;
        gGetTradesContext.bNeedToAddSymbol = bNeedToAddSymbol;
        gGetTradesContext.idxStart = 0;

        window.setTimeout("GetTrades(false)", 10);
        return;

    }
    if (gbStopGetTrades) {
        GetTradesCanceled();
        return;
    }
    if (bOk) {
        if (gSymbols.length > 0) {

            GetCurrentPrices();

            let iPwdFormHeight = document.getElementById("pwdForm").clientHeight + 10;
            document.getElementById("tblSymbols").style.top = iPwdFormHeight.toString() + "px";
            document.getElementById("tblSymbols").style.left = "0px";

            document.getElementById("tblSymbols").style.width = "500px";
            document.getElementById("nameTitle").style.width = "480px";
            document.getElementById("tblSymbols").style.visibility = "visible";
            document.getElementById("tblDetail").style.top = iPwdFormHeight.toString() + "px";
            document.getElementById("tblDetail").style.left = "510px";
            document.getElementById("tblDetail").style.width = "520px";
            document.getElementById("detailTitle").style.width = "500px";
            document.getElementById("tblDetail").style.visibility = "hidden";
            gSymbols.sort(sortBySymbolAndAccountname);
            document.getElementById("nameTitle").innerHTML = "Symbols";
            //                document.getElementById("nameTitle2").innerHTML = "<span style='color: red;'>*</span>&nbsp;=&nbsp;option";
            let sSymbolDisplay = "<table style=\"width:100%;border-width:0px;\">";
            let s = "";
            let sLastSymbol = "";
            let sSymbol = "";
            let sTmp = "";
            let sAccountName = "";
            let dTotalBuy = 0.0;
            let dTotalSell = 0.0;
            let dTotalShares = 0.0;
            let dCurrentPrice = 0.0;
            let dTotalFees = 0.0;

            let dTotalLongShort = 0.0;
            let dTotalLongShortFees = 0.0;
            let iTotalLongShortSymbols = 0;

            let sLastAssetType = "";
            let bNeedTotal = false;

            let totalBackgroundColor = "lightgray";
            let symbolTextColor = "blue";

            let iTRId = 0;
            let sTRId = "";

            //debugger
            let bDoingLong = true;
            let bNeedTotalLongShort = false;
            for (let idxLongShort = 0; idxLongShort < 2; idxLongShort++) {
                sLastSymbol = "";
                s = "";
                iTotalLongShortSymbols = 0;
                if (idxLongShort == 0) {
                    sSymbolDisplay = sSymbolDisplay + "<tr><td colspan=\"6\" style=\"text-align:center; color:" + gsNegativeColor + "; font-size:16pt; height: 30px; width: 100 %; vertical - align: middle; border - width: 0px; border - style: solid; border - spacing: 1px; border - color: White\"><b>Long Symbols</b></td></tr>";
                    bDoingLong = true;
                } else {
                    dTotalLongShort = 0.0;
                    dTotalLongShortFees = 0.0;
                    bNeedTotalLongShort = false;
                    sSymbolDisplay = sSymbolDisplay + "<tr><td colspan=\"6\" style=\"text-align:center; color:" + gsNegativeColor + "; font-size:16pt; height:30px; width:100%; vertical-align:middle;border-width:0px; border-style:solid; border-spacing:1px; border-color:White\"><b>Short Symbols</b></td></tr>";
                    bDoingLong = false;
                }
                for (let idx = 0; idx < gSymbols.length; idx++) {
                    if (sLastSymbol == "") {
                        sSymbol = gSymbols[idx].symbol;
                        //if (sSymbol.toUpperCase() == "ETSY") {
                        //    debugger
                        //}
                        sLastSymbol = sSymbol;
                        sAccountName = gSymbols[idx].accountName;
                        s = s + "<tr><td colspan=\"6\" style=\"color:" + symbolTextColor + "; height:20px; width:100%; vertical-align:top; border-width:0px; border-style:solid; border-spacing:1px; border-color:White\"><b>" + (gSymbols[idx].assetType === "OPTION" ? " <span style='color:red;'>*&nbsp;</span>" : "") + sSymbol + "</b> - xxxxxxxxxxxx</td></tr > ";
                        s = s + "<tr>";
                        s = s + "<td style=\"width:20%; vertical-align:top;border-width:0px;\"><I>Account</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Buy</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Sell</I></td>";
                        s = s + "<td style=\"width:13%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Shares</I></td>";
                        s = s + "<td style=\"width:14%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Price</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>G/L</I></td>";
                        s = s + "</tr>";

                        s = s + "<tr>";

                        iTRId++;
                        sTRId = "TDSym" + iTRId.toString();
                        s = s + "<td id=\"" + sTRId + "\" style=\"width:20%; vertical-align:top;border-width:0px;\"><a href=\"JavaScript: DoGetTradesBySymbol('" + sSymbol + "','" + gSymbols[idx].accountId + "','" + sAccountName + "','" + sTRId + "', " + idx.toString() + ") \">" + sAccountName + "</a></td > ";

                        //                        sTmp = FormatMoney(gSymbols[idx].buy);
                        sTmp = FormatDecimalNumber(gSymbols[idx].buy, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + "; vertical - align: top; border - width: 0px; \">" + sTmp + "</td>";
                        dTotalBuy = gSymbols[idx].buy;

                        //                        sTmp = FormatMoney(gSymbols[idx].sell);
                        sTmp = FormatDecimalNumber(gSymbols[idx].sell, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalSell = gSymbols[idx].sell;

                        //                        sTmp = FormatInt(gSymbols[idx].shares);
                        sTmp = FormatDecimalNumber(gSymbols[idx].shares, 3, 1, "");
                        s = s + "<td style=\"width:13%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalShares = gSymbols[idx].shares;

                        //sTmp = FormatDecimalNumber(gSymbols[idx].fees, 5, 2, "");
                        //s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalFees = gSymbols[idx].fees;

                        let oSymbolPrice = new SymbolPrice();
                        sLastAssetType = gSymbols[idx].assetType;
                        oSymbolPrice = gSymbols[idx].SymbolPrice;
                        if (sLastAssetType == "OPTION") {
                            gSymbols[idx].description = oSymbolPrice.description;
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            s = s.replace("xxxxxxxxxxxx", oSymbolPrice.description);
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            //                            sTmp = FormatMoney(dCurrentPrice);
                            sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                            s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice), 3, 2, "");
                        } else {
                            gSymbols[idx].description = oSymbolPrice.description;
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            s = s.replace("xxxxxxxxxxxx", oSymbolPrice.description);
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            //                            sTmp = FormatMoney(dCurrentPrice);
                            sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                            s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice), 3, 2, "");
                        }

                        if (sTmp.indexOf("-") != -1) {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        } else {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        }

                        s = s + "</tr>";
                        bNeedTotal = true;


                    } else if (sLastSymbol == gSymbols[idx].symbol) {
                        sSymbol = gSymbols[idx].symbol;
                        sAccountName = gSymbols[idx].accountName;
                        s = s + "<tr>";

                        iTRId++;
                        sTRId = "TDSym" + iTRId.toString();
                        s = s + "<td id=\"" + sTRId + "\" style=\"width:20%; vertical-align:top;border-width:0px;\"><a href=\"JavaScript: DoGetTradesBySymbol('" + sSymbol + "','" + gSymbols[idx].accountId + "','" + sAccountName + "','" + sTRId + "', " + idx.toString() + ") \">" + sAccountName + "</a></td > ";
                        //                        sTmp = FormatMoney(gSymbols[idx].buy);
                        sTmp = FormatDecimalNumber(gSymbols[idx].buy, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalBuy = dTotalBuy + gSymbols[idx].buy;

                        //                        sTmp = FormatMoney(gSymbols[idx].sell);
                        sTmp = FormatDecimalNumber(gSymbols[idx].sell, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalSell = dTotalSell + gSymbols[idx].sell;

                        //                        sTmp = FormatInt(gSymbols[idx].shares);
                        sTmp = FormatDecimalNumber(gSymbols[idx].shares, 3, 1, "");
                        s = s + "<td style=\"width:13%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalShares = dTotalShares + gSymbols[idx].shares;

                        //sTmp = FormatDecimalNumber(gSymbols[idx].fees, 5, 2, "");
                        //s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalFees = dTotalFees + gSymbols[idx].fees;

                        //                        sTmp = FormatMoney(dCurrentPrice);
                        sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                        s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";


                        if (sLastAssetType == "OPTION") {
                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice), 3, 2, "");
                        } else {
                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice), 3, 2, "");
                        }
                        if (sTmp.indexOf("-") != -1) {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        } else {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        }

                        s = s + "</tr>";

                    } else {
                        let bOkToContinue = false;
                        if (dTotalShares < 0.0) {
                            if (!bDoingLong) {
                                bOkToContinue = true;
                                bNeedTotalLongShort = true;
                            }
                        } else {
                            if (bDoingLong) {
                                bOkToContinue = true;
                                bNeedTotalLongShort = true;
                            }
                        }
                        if (bOkToContinue) {
                            iTotalLongShortSymbols++;
                            dTotalLongShortFees = dTotalLongShortFees + dTotalFees;
                            //show total and then first lines of new symbol
                            s = s + "<tr style=\"background-color:" + totalBackgroundColor + "; \">";

                            s = s + "<td style=\"width:20%; vertical-align:top;border-width:0px;\"><I>Total</I></td > ";
                            //                        sTmp = FormatMoney(dTotalBuy);
                            sTmp = FormatDecimalNumber(dTotalBuy, 5, 2, "");
                            s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                        sTmp = FormatMoney(dTotalSell);
                            sTmp = FormatDecimalNumber(dTotalSell, 5, 2, "");
                            s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                        sTmp = FormatInt(gSymbols[idx].shares);
                            sTmp = FormatDecimalNumber(dTotalShares, 3, 1, "");
                            s = s + "<td style=\"width:13%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                        sTmp = FormatMoney(dCurrentPrice);
                            sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                            s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            if (sLastAssetType == "OPTION") {
                                //                            sTmp = FormatMoney((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice));
                                sTmp = FormatDecimalNumber((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice), 3, 2, "");
                                dTotalLongShort = dTotalLongShort + ((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice));
                            } else {
                                //                            sTmp = FormatMoney((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice));
                                sTmp = FormatDecimalNumber((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice), 3, 2, "");
                                dTotalLongShort = dTotalLongShort + ((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice));
                            }
                            if (sTmp.indexOf("-") != -1) {
                                s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorLoss + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                            } else {
                                s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorGain + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                            }

                            s = s + "</tr>";
                            sSymbolDisplay = sSymbolDisplay + s;
                        }

                        s = "";
                        sSymbol = gSymbols[idx].symbol;

                        sLastSymbol = sSymbol;
                        sAccountName = gSymbols[idx].accountName;
                        s = s + "<tr><td colspan=\"6\" style=\"color: " + symbolTextColor + "; height: 20px; width: 100 %; vertical - align: top; border - width: 0px; border - style: solid; border - spacing: 1px; border - color: White\"><b>" + (gSymbols[idx].assetType === "OPTION" ? " <span style='color: red;'>*&nbsp;</span>" : "") + sSymbol + "</b> - xxxxxxxxxxxx</td></tr>";
                        s = s + "<tr>";

                        s = s + "<td style=\"width:20%; vertical-align:top;border-width:0px;\"><I>Account</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Buy</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Sell</I></td>";
                        s = s + "<td style=\"width:13%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Shares</I></td>";
                        s = s + "<td style=\"width:14%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>Price</I></td>";
                        s = s + "<td style=\"width:19%; text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>G/L</I></td>";

                        s = s + "</tr>";

                        s = s + "<tr style=\"border-width; 2px 0px 0px 0px;border-bottom-color:black;\">";

                        iTRId++;
                        sTRId = "TDSym" + iTRId.toString();
                        s = s + "<td id=\"" + sTRId + "\" style=\"width:20%; vertical-align:top;border-width:0px;\"><a href=\"JavaScript: DoGetTradesBySymbol('" + sSymbol + "','" + gSymbols[idx].accountId + "','" + sAccountName + "','" + sTRId + "', " + idx.toString() + ") \">" + sAccountName + "</a></td > ";

                        //                        sTmp = FormatMoney(gSymbols[idx].buy);
                        sTmp = FormatDecimalNumber(gSymbols[idx].buy, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalBuy = gSymbols[idx].buy;

                        //                        sTmp = FormatMoney(gSymbols[idx].sell);
                        sTmp = FormatDecimalNumber(gSymbols[idx].sell, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalSell = gSymbols[idx].sell;

                        //                        sTmp = FormatInt(gSymbols[idx].shares);
                        sTmp = FormatDecimalNumber(gSymbols[idx].shares, 3, 1, "");
                        s = s + "<td style=\"width:13%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalShares = gSymbols[idx].shares;

                        //sTmp = FormatDecimalNumber(gSymbols[idx].fees, 5, 2, "");
                        //s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        dTotalFees = gSymbols[idx].fees;

                        let oSymbolPrice = new SymbolPrice();
                        sLastAssetType = gSymbols[idx].assetType;
                        oSymbolPrice = gSymbols[idx].SymbolPrice;
                        if (sLastAssetType == "OPTION") {
                            gSymbols[idx].description = oSymbolPrice.description;
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            s = s.replace("xxxxxxxxxxxx", oSymbolPrice.description);
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            //                            sTmp = FormatMoney(dCurrentPrice);
                            sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                            s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * 100 * dCurrentPrice), 3, 2, "");
                        } else {
                            gSymbols[idx].description = oSymbolPrice.description;
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            s = s.replace("xxxxxxxxxxxx", oSymbolPrice.description);
                            dCurrentPrice = oSymbolPrice.price; //get the current price here
                            //                            sTmp = FormatMoney(dCurrentPrice);
                            sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                            s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                            //                            sTmp = FormatMoney((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * gSymbols[idx].buy) + gSymbols[idx].sell + (gSymbols[idx].shares * dCurrentPrice), 3, 2, "");
                        }

                        if (sTmp.indexOf("-") != -1) {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        } else {
                            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        }

                        s = s + "</tr>";
                        bNeedTotal = true;

                    }
                }
                if (bNeedTotal) {
                    bNeedTotal = false;
                    let bOkToContinue = false;
                    if (dTotalShares < 0.0) {
                        if (!bDoingLong) {
                            bOkToContinue = true;
                            bNeedTotalLongShort = true;
                        }
                    } else {
                        if (bDoingLong) {
                            bOkToContinue = true;
                            bNeedTotalLongShort = true;
                        }
                    }
                    if (bOkToContinue) {
                        iTotalLongShortSymbols++;
                        dTotalLongShortFees = dTotalLongShortFees + dTotalFees;
                        s = s + "<tr style=\"background-color:" + totalBackgroundColor + "; \">";

                        s = s + "<td style=\"width:20%; vertical-align:top;border-width:0px;\"><I>Total</I></td > ";
                        //                    sTmp = FormatMoney(dTotalBuy);
                        sTmp = FormatDecimalNumber(dTotalBuy, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                        //                    sTmp = FormatMoney(dTotalSell);
                        sTmp = FormatDecimalNumber(dTotalSell, 5, 2, "");
                        s = s + "<td style=\"width:19%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                        //                    sTmp = FormatInt(dTotalShares);
                        sTmp = FormatDecimalNumber(dTotalShares, 3, 1, "");
                        s = s + "<td style=\"width:13%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                        //                    sTmp = FormatMoney(dCurrentPrice);
                        sTmp = FormatDecimalNumber(dCurrentPrice, 3, 2, "");
                        s = s + "<td style=\"width:14%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

                        if (sLastAssetType == "OPTION") {
                            //                        sTmp = FormatMoney((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice), 3, 2, "");
                            dTotalLongShort = dTotalLongShort + ((-1 * dTotalBuy) + dTotalSell + (dTotalShares * 100 * dCurrentPrice));
                        } else {
                            //                        sTmp = FormatMoney((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice));
                            sTmp = FormatDecimalNumber((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice), 3, 2, "");
                            dTotalLongShort = dTotalLongShort + ((-1 * dTotalBuy) + dTotalSell + (dTotalShares * dCurrentPrice));
                        }
                        if (sTmp.indexOf("-") != -1) {
                            s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorLoss + ";width:15%;text-align:" + sBodyTextAlign + "; vertical - align: top; border - width: 0px; \">" + sTmp + "</td>";
                        } else {
                            s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorGain + ";width:15%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                        }

                        s = s + "</tr>";
                        sSymbolDisplay = sSymbolDisplay + s;

                    }
                }
                if (bNeedTotalLongShort) {
                    s = "<tr style=\"background-color:" + totalBackgroundColor + "; \">";

                    if (bDoingLong) {
                        s = s + "<td colspan=\"5\" style=\"text-align:left; vertical-align:top;border-width:0px;\"><I>" + iTotalLongShortSymbols.toString() + " Symbols Total Long --- Total Fees $" + FormatDecimalNumber(dTotalLongShortFees, 5, 2, "") + "</I ></td > ";
                    } else {
                        s = s + "<td colspan=\"5\" style=\"text-align:left; vertical-align:top;border-width:0px;\"><I>" + iTotalLongShortSymbols.toString() + " Symbols Total Short --- Total Fees $" + FormatDecimalNumber(dTotalLongShortFees, 5, 2, "") + "</I></td > ";
                    }
                    sTmp = FormatDecimalNumber(dTotalLongShort, 3, 2, "");
                    if (sTmp.indexOf("-") != -1) {
                        s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorLoss + ";text-align:right;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                    } else {
                        s = s + "<td style=\"background-color:" + totalBackgroundColor + "; color: " + sTotalsColorGain + ";text-align:right;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
                    }

                    s = s + "</tr>";
                    sSymbolDisplay = sSymbolDisplay + s;
                }

            }
            sSymbolDisplay = sSymbolDisplay + "</table>";
            document.getElementById("name").innerHTML = sSymbolDisplay;

        } else {
            let iPwdFormHeight = document.getElementById("pwdForm").clientHeight + 10;
            document.getElementById("tblSymbols").style.top = iPwdFormHeight.toString() + "px";
            document.getElementById("tblSymbols").style.width = "500px";
            document.getElementById("nameTitle").style.width = "480px";
            document.getElementById("tblSymbols").style.visibility = "visible";
            document.getElementById("tblDetail").style.visibility = "hidden";
            let s = "<table style=\"width:100%;border-width:0px;\">";
            s = s + "<tr><td colspan=\"6\" style=\"height:20px;width:100%;vertical-align:top;border-width:0px; border-style:solid;border-spacing:1px;border-color:White\">Account information not found for the specified symbols.</td></tr>";
            s = s + "</table>";
            document.getElementById("name").innerHTML = s;
        }

    }

    //ShowProgress(false, true);
    //SetDefault();
    //document.pwdForm.btnGetTrades.value = "Get Trades";
    //gbDoingGetTrades = false;
    GetTradesCanceled();
}

function GetTradesAddSymbol(iAccountsIdx, sSymbolsToLookup, sRADSymbol, oTradeIn) {
    let oTrade = new Trade();
    let bNeedToAddSymbol = false;
    oTrade.accountId = oTradeIn.accountId
    oTrade.accountName = oTradeIn.accountName;
    oTrade.amount = oTradeIn.amount;
    oTrade.assetType = oTradeIn.assetType;
    oTrade.cost = oTradeIn.cost;
    oTrade.date = oTradeIn.date;
    oTrade.netAmount = oTradeIn.netAmount;
    oTrade.fees = oTradeIn.fees;
    oTrade.price = oTradeIn.price;
    oTrade.symbol = oTradeIn.symbol;
    oTrade.transactionSubType = oTradeIn.transactionSubType;

    if ((sSymbolsToLookup.indexOf("," + sRADSymbol.toUpperCase() + ",") != -1) ||
        (sSymbolsToLookup == "ALLSYMBOLS")) {
        bNeedToAddSymbol = true;
        if (gSymbols.length > 0) {
            for (let idxTmp = 0; idxTmp < gSymbols.length; idxTmp++) {
                if ((gSymbols[idxTmp].symbol == sRADSymbol) &&
                    (gSymbols[idxTmp].accountId == gAccounts[iAccountsIdx].accountId)) {
                    bNeedToAddSymbol = false;
                    if (oTrade.netAmount < 0.0) {
                        //buy
                        gSymbols[idxTmp].shares = gSymbols[idxTmp].shares + oTrade.amount;
                        gSymbols[idxTmp].buy = gSymbols[idxTmp].buy - oTrade.netAmount;
                    } else {
                        //sell
                        gSymbols[idxTmp].shares = gSymbols[idxTmp].shares - oTrade.amount;
                        gSymbols[idxTmp].sell = gSymbols[idxTmp].sell + oTrade.netAmount;
                    }
                    gSymbols[idxTmp].trades[gSymbols[idxTmp].trades.length] = oTrade;
                    gSymbols[idxTmp].fees = gSymbols[idxTmp].fees + oTrade.fees;
                    break;
                }
            }
        }
    }
    if (bNeedToAddSymbol) {
        let oSymbol = new Symbol();
        oSymbol.symbol = oTrade.symbol;
        oSymbol.accountId = gAccounts[iAccountsIdx].accountId;
        oSymbol.accountName = gAccounts[iAccountsIdx].accountName;
        oSymbol.assetType = oTrade.assetType;
        if (oTrade.netAmount < 0.0) {
            //buy
            oSymbol.shares = oTrade.amount;
            oSymbol.buy = -1 * oTrade.netAmount;
        } else {
            //sell
            oSymbol.shares = -1 * oTrade.amount;
            oSymbol.sell = oTrade.netAmount;
        }
        oSymbol.trades[oSymbol.trades.length] = oTrade;
        oSymbol.fees = oTrade.fees; //03/10/21 changed oSymbol = to oSymbol.fees = 
        gSymbols[gSymbols.length] = oSymbol;
    }

}

function GetTradesBySymbol(sSymbolToLookup, sAccountID, sAccountName, sTRId, idxSymbol) {
    let sBodyTextAlign = "right";
    let sTotalsBackcolor = gsBodyBackgroundColor;
    let sTotalsColorGain = "green";
    let sTotalsColorLoss = gsNegativeColor;

    //        //debugger
    let oTrade = new Trade();

    let oSymbolPrice = new SymbolPrice();

    sStartDate = gsLastStartDate;
    sEndDate = gsLastEndDate;
    gTrades.length = 0;
    SetWait();

    let iPwdFormHeight = document.getElementById("pwdForm").clientHeight + 10;
    let iDetailTop = document.getElementById(sTRId).offsetTop + iPwdFormHeight;
    document.getElementById("tblDetail").style.top = iDetailTop.toString() + "px";

    document.getElementById("misc").innerHTML = "";
    document.getElementById("miscname").innerHTML = "";
    document.getElementById("mischead").innerHTML = "";

    //now show in table
    let s = "<table style=\"width:100%;border-width:0px;\">";
    let sTmp = "";
    let iTotalShares = 0;
    let dTotalFees = 0.0;
    let dTotalNet = 0.0;

    //debugger
    let oTrades = new Array();
    oTrades = gSymbols[idxSymbol].trades;
    for (let idx = 0; idx < oTrades.length; idx++) {
        oTrade = oTrades[idx];

        s = s + "<tr>";

        let d = new Date(oTrade.date.split("+")[0] + "+00:00");
        let sDate = FormatTDTradeDate(d) + "&nbsp;(" + oTrade.transactionSubType + ")";

        s = s + "<td style=\"width:36%; font-size:10pt; vertical-align:center;border-width:0px;\">" + sDate + "</td > ";
        sTmp = FormatInt(oTrade.amount);
        if (oTrade.netAmount < 0.0) {
            iTotalShares = iTotalShares + oTrade.amount;
            s = s + "<td style=\"width:10%; text-align:center;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
        } else {
            iTotalShares = iTotalShares - oTrade.amount;
            s = s + "<td style=\"width:10%; text-align:center;vertical-align:top;border-width:0px;\">-" + sTmp + "</td>";
        }

        sTmp = FormatMoney(oTrade.price);
        //                                    sTmp = FormatDecimalNumber(oTrade.price, 5, 2, "");
        s = s + "<td style=\"width:18%; text-align:center;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

        dTotalFees = dTotalFees + oTrade.fees;
        if (oTrade.fees == 0) {
            sTmp = "&nbsp;";
            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:center; vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
        } else {
            sTmp = FormatMoney(oTrade.fees);
            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:center; vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
            //    sTmp = FormatMoney(oTrade.cost);
            //    //                                    sTmp = FormatDecimalNumber(oTrade.cost, 5, 2, "");
            //    if (sTmp.indexOf("-") != -1) {
            //        s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
            //    } else {
            //        s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
            //    }
        }
        dTotalNet = dTotalNet + oTrade.netAmount;
        sTmp = FormatMoney(oTrade.netAmount);
        //                                    sTmp = FormatDecimalNumber(oTrade.netAmount, 5, 2, "");
        if (sTmp.indexOf("-") != -1) {
            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
        } else {
            s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
        }
        s = s + "</tr>";

    }
    //add a total row
    s = s + "<tr>";
    s = s + "<td style=\"width:36%; vertical-align:center;border-width:0px;\"><b>Total</b></td > ";
    sTmp = FormatInt(iTotalShares);
    s = s + "<td style=\"width:10%; text-align:center;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

    if (oTrade.assetType == "OPTION") {
        oSymbolPrice = GetCurrentPriceOption(sSymbolToLookup);
    } else {
        oSymbolPrice = GetCurrentPrice(sSymbolToLookup);
    }

    sTmp = FormatMoney(oSymbolPrice.price);
    s = s + "<td style=\"width:18%; text-align:center;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

    sTmp = FormatMoney(dTotalFees);
    s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:center; vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
    //    s = s + "<td style=\"width:10%; text-align:center;vertical-align:top;border-width:0px;\">" + sTmp + "</td>";

    if (iTotalShares != 0) {
        if (oTrade.assetType == "OPTION") {
            dTotalNet = dTotalNet + (iTotalShares * 100 * oSymbolPrice.price);
        } else {
            dTotalNet = dTotalNet + (iTotalShares * oSymbolPrice.price);
        }
    }
    sTmp = FormatMoney(dTotalNet);
    //                                    sTmp = FormatDecimalNumber(oTrade.netAmount, 5, 2, "");
    if (sTmp.indexOf("-") != -1) {
        s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorLoss + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
    } else {
        s = s + "<td style=\"background-color:" + sTotalsBackcolor + "; color: " + sTotalsColorGain + ";width:18%; text-align:" + sBodyTextAlign + ";vertical-align:top;border-width:0px;\">" + sTmp + "</td>";
    }

    s = s + "</tr>";

    s = s + "</table>";
    document.getElementById("misc").innerHTML = s;

    s = "<table style=\"border-width:0px; border-style:solid;border-spacing:0px;border-color:White;width:100%\"><tr><th style=\"height:18px;border-width:1px;border-style:solid;border-spacing:1px;border-color:White;\">";

    s = s + sSymbolToLookup + " - " + sAccountName;

    s = s + "</th></tr></table>";

    document.getElementById("miscname").innerHTML = s;

    s = "<table style=\"border-width:0px;width:100%\">";
    s = s + "<tr>";
    s = s + "<th style=\"width:36%; vertical-align:top;border-width:0px;\"><I>Date</I></th>";
    s = s + "<th style=\"width:10%; text-align:center;vertical-align:top;border-width:0px;\"><I>Shares</I></th>";
    s = s + "<th style=\"width:18%; text-align:center;vertical-align:top;border-width:0px;\"><I>Price</I></th>";
    s = s + "<th style=\"width:18%; text-align:center;vertical-align:top;border-width:0px;\"><I>Fees</I></th>";
    s = s + "<th style=\"width:18%; text-align:center;vertical-align:top;border-width:0px;\"><I>Net</I></th>";
    s = s + "</tr></table>";
    document.getElementById("mischead").innerHTML = s;

    SetDefault();
}

function GetTradesCanceled() {
    ShowProgress(false, true);
    document.pwdForm.btnGetTrades.value = "Get Trades";
    gbDoingGetTrades = false;
    gbStopGetTrades = false;
    SetDefault();
}

function GetUniqueListOfSymbols(sInSymbols) {
    let sOrigSymbols = TrimLikeVB(sInSymbols.toUpperCase());
    if (sOrigSymbols != "") {
        let aSymbols = sOrigSymbols.split(",");
        let sSymbols = ",";
        let sSep = ",";
        for (let idx = 0; idx < aSymbols.length; idx++) {
            let sTmp = TrimLikeVB(aSymbols[idx]);
            if (sTmp != "") {
                if (sSymbols.indexOf(sSep + sTmp + sSep) == -1) {
                    sSymbols = sSymbols + sTmp + sSep;
                }
            }
        }
        if (sSymbols.length > 1) {
            return sSymbols.substr(1, sSymbols.length - 2); //remove preceding and trailing commas
        } else {
            return "";
        }

    } else {
        return "";
    }

}

function GetWatchlistPrices() {

    let oWLItemDetail = new WLItemDetail();
    let dt = new Date();
    let sDate = FormatDateWithTime(dt, true, false);

    if (gWatchlists.length > 0) {
        for (let idxWLMain = 0; idxWLMain < gWatchlists.length; idxWLMain++) {
            if (gWatchlists[idxWLMain].bSelected) {
                let sSymbols = "";
                let sSep = "";
                for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWLMain].WLItems.length; idxWLItem++) {
                    if (gWatchlists[idxWLMain].WLItems[idxWLItem].bSelected) {
                        sSymbols = sSymbols + sSep + gWatchlists[idxWLMain].WLItems[idxWLItem].symbol;
                        sSep = ",";
                    }
                }
                sSymbols = GetUniqueListOfSymbols(sSymbols);

                if (sSymbols.length > 0) {
                    let aSymbolsToUse = sSymbols.split(",");

                    gWLDisplayed.length = 0;
                    for (let idxSymbol = 0; idxSymbol < aSymbolsToUse.length; idxSymbol++) {
                        let sSymbol = aSymbolsToUse[idxSymbol];
                        if (!isUndefined(oMDQ[sSymbol])) {
                            let oWLDisplayed = new WLDisplayed();
                            oWLDisplayed.symbol = sSymbol;
                            oWLDisplayed.assetType = oMDQ[sSymbol].assetType;

                            //get account position info if it exists
                            let oPositions = new Array();
                            for (let idxAccount = 0; idxAccount < gAccounts.length; idxAccount++) {
                                if ((gAccounts[idxAccount].positions.length > 0) &&
                                    (gAccounts[idxAccount].accountId == gWatchlists[idxWLMain].accountId)) {
                                    for (let idxPositions = 0; idxPositions < gAccounts[idxAccount].positions.length; idxPositions++) {
                                        if (gAccounts[idxAccount].positions[idxPositions].symbol == sSymbol) {
                                            let oPosition = new Position();
                                            oPosition = gAccounts[idxAccount].positions[idxPositions];
                                            oPosition.accountId = gAccounts[idxAccount].accountId;
                                            oPosition.accountName = gAccounts[idxAccount].accountName;
                                            oPositions[oPositions.length] = oPosition;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }

                            oWLItemDetail = new WLItemDetail();
                            if (oWLDisplayed.assetType == "OPTION") {
                                if (!isUndefined(oMDQ[sSymbol].mark)) {
                                    oWLItemDetail.lastPrice = oMDQ[sSymbol].mark;
                                }
                            } else if (oWLDisplayed.assetType == "INDEX") {
                                if (!isUndefined(oMDQ[sSymbol].lastPrice)) {
                                    oWLItemDetail.lastPrice = oMDQ[sSymbol].lastPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].highPrice)) {
                                    oWLItemDetail.highPrice = oMDQ[sSymbol].highPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].lowPrice)) {
                                    oWLItemDetail.lowPrice = oMDQ[sSymbol].lowPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].netChange)) {
                                    oWLItemDetail.netChange = oMDQ[sSymbol].netChange;
                                }
                                if (!isUndefined(oMDQ[sSymbol].netPercentChangeInDouble)) {
                                    oWLItemDetail.netPercentChangeInDouble = oMDQ[sSymbol].netPercentChangeInDouble;
                                }
                            } else {
                                if (!isUndefined(oMDQ[sSymbol].lastPrice)) {
                                    oWLItemDetail.lastPrice = oMDQ[sSymbol].lastPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].askPrice)) {
                                    oWLItemDetail.askPrice = oMDQ[sSymbol].askPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].bidPrice)) {
                                    oWLItemDetail.bidPrice = oMDQ[sSymbol].bidPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].highPrice)) {
                                    oWLItemDetail.highPrice = oMDQ[sSymbol].highPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].lowPrice)) {
                                    oWLItemDetail.lowPrice = oMDQ[sSymbol].lowPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].netChange)) {
                                    oWLItemDetail.netChange = oMDQ[sSymbol].netChange;
                                }
                                if (!isUndefined(oMDQ[sSymbol].netPercentChangeInDouble)) {
                                    oWLItemDetail.netPercentChangeInDouble = oMDQ[sSymbol].netPercentChangeInDouble;
                                }

                                if (!isUndefined(oMDQ[sSymbol].regularMarketLastPrice)) {
                                    oWLItemDetail.regularMarketLastPrice = oMDQ[sSymbol].regularMarketLastPrice;
                                }
                                if (!isUndefined(oMDQ[sSymbol].regularMarketNetChange)) {
                                    oWLItemDetail.regularMarketNetChange = oMDQ[sSymbol].regularMarketNetChange;
                                }
                                if (!isUndefined(oMDQ[sSymbol].regularMarketPercentChangeInDouble)) {
                                    oWLItemDetail.regularMarketPercentChangeInDouble = oMDQ[sSymbol].regularMarketPercentChangeInDouble;
                                }
                                //"peRatio": 33.3568,
                                if (!isUndefined(oMDQ[sSymbol].peRatio)) {
                                    oWLItemDetail.peRatio = oMDQ[sSymbol].peRatio;
                                }
                                //"divAmount": 0.82,
                                if (!isUndefined(oMDQ[sSymbol].divAmount)) {
                                    oWLItemDetail.divAmount = oMDQ[sSymbol].divAmount;
                                }
                                //"divYield": 0.67,
                                if (!isUndefined(oMDQ[sSymbol].divYield)) {
                                    oWLItemDetail.divYield = oMDQ[sSymbol].divYield;
                                }
                                //"divDate": "2021-02-05 00:00:00.000",
                                if (!isUndefined(oMDQ[sSymbol].divDate)) {
                                    oWLItemDetail.divDate = oMDQ[sSymbol].divDate;
                                }

                            }
                            if (oPositions.length > 0) {
                                for (let idxPositions = 0; idxPositions < oPositions.length; idxPositions++) {
                                    let oPosition = new Position();
                                    oPosition = oPositions[idxPositions];

                                    oWLItemDetail.shares = 0;
                                    oWLItemDetail.dayGain = 0.0;
                                    oWLItemDetail.costPerShare = 0.0;
                                    oWLItemDetail.gain = 0.0;
                                    oWLItemDetail.gainPercent = 0.0;
                                    oWLItemDetail.accountId = "";
                                    oWLItemDetail.marketValue = oPosition.marketValue;

                                    oWLItemDetail.accountId = oPosition.accountId;
                                    oWLItemDetail.accountName = oPosition.accountName;
                                    oWLItemDetail.shares = oPosition.longQuantity;
                                    oWLItemDetail.dayGain = oPosition.currentDayProfitLoss;
                                    oWLItemDetail.costPerShare = oPosition.averagePrice;
                                    if (oWLItemDetail.shares > 0) {
                                        oWLItemDetail.gain = oWLItemDetail.shares * (oWLItemDetail.regularMarketLastPrice - oWLItemDetail.costPerShare);
                                        if (oWLItemDetail.costPerShare != 0.0) {
                                            oWLItemDetail.gainPercent = ((oWLItemDetail.regularMarketLastPrice - oWLItemDetail.costPerShare) / oWLItemDetail.costPerShare) * 100.0;
                                        }
                                    }
                                    oWLDisplayed.WLItemDetails[oWLDisplayed.WLItemDetails.length] = oWLItemDetail;
                                }
                            } else {
                                oWLDisplayed.WLItemDetails[oWLDisplayed.WLItemDetails.length] = oWLItemDetail;
                            }
                            gWLDisplayed[gWLDisplayed.length] = oWLDisplayed;

                        }
                    }

                    //now show the results
                    let sThisDiv = "";
                    let sThisTable = "";
                    let sLastWLName = "";
                    let sLastWLAccountName = "";
                    let sLastWLAccountId = "";
                    let sThisId = "";
                    let sHeadingTextAlign = "right";
                    let sBodyTextAlign = "right";
                    let sTableRowVerticalAlignment = "middle";
                    let sTmp = "";
                    let bEverythingIsChecked = true;

                    if (gWLDisplayed.length > 0) {

                        gWLDisplayed.sort(sortBySymbol);

                        bEverythingIsChecked = true;
                        let iTotalSymbolsUp = 0;
                        let iTotalSymbolsDown = 0;
                        let iTotalSymbolsUpDay = 0;
                        let iTotalSymbolsDownDay = 0;
                        let sSymbolsThisWL = "";
                        let sSymbolsSelectedForOrderThisWL = "";
                        let sSep = "";
                        let sSepForOrder = "|";

                        let bDoingDividendWL = false;
                        if (gWatchlists[idxWLMain].name.toUpperCase().indexOf("DIVIDEND") != -1) {
                            bDoingDividendWL = true;
                        }

                        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWLMain].WLItems.length; idxWLItem++) {
                            if (gWatchlists[idxWLMain].WLItems[idxWLItem].bSelected) {
                                sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWLMain].WLItems[idxWLItem].symbol;
                                sSep = ",";

                                //sSymbolsSelectedForOrderThisWL will contain: |symbol,idxWLItem,true|symbol,idxWLItem,false...
                                sSymbolsSelectedForOrderThisWL = sSymbolsSelectedForOrderThisWL + sSepForOrder + gWatchlists[idxWLMain].WLItems[idxWLItem].symbol + "," + idxWLItem.toString() + "," + gWatchlists[idxWLMain].WLItems[idxWLItem].bSelectedForOrder;
                            }
                        }
                        sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";

                        sThisDiv = "";
                        sLastWLName = gWatchlists[idxWLMain].name;
                        sLastWLAccountName = gWatchlists[idxWLMain].accountName;
                        sLastWLAccountId = gWatchlists[idxWLMain].accountId;
                        sThisId = gWatchlists[idxWLMain].watchlistId + sLastWLAccountId;

                        if (gbUsingCell) {
                            if (gWatchlists[idxWLMain].watchlistId == sLastWLAccountId) { //don't show Open and Close if this is an Account watchlist
                                sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                sThisDiv = sThisDiv + "<tr>";

                                sThisDiv = sThisDiv + "<th colspan=\"3\" style=\"height:30px;vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:0px; border-style:solid; border-spacing:1px; border-color:White\">" +
                                    "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                                    "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" +
                                    "<span style=\"vertical-align: middle;\" id=\"spanWLDate" + sThisId + "\" name=\"spanWLDate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th >";

                                sThisDiv = sThisDiv + "<th style=\"height:30px;text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                                sThisDiv = sThisDiv + "</tr>";

                                sThisDiv = sThisDiv + "<tr>";

                            } else {
                                if (bDoingDividendWL) {
                                    sThisDiv = sThisDiv + "<div style=\"width:950px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisDiv = sThisDiv + "<table style=\"width::950px; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                } else {
                                    sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                }
                                sThisDiv = sThisDiv + "<tr>";
                                //style=\"vertical-align:bottom\">
                                sThisDiv = sThisDiv + "<th style=\"height:30px; text-align:left; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                                    "<img width=\"20\" height=\"20\" style=\"vertical-align:middle\" src=\"delete-button-24px.png\" onclick=\"DoWLDeleteSymbols(" + idxWLMain.toString() + ")\" />" +
                                    "&nbsp;&nbsp;<img width=\"20\" height=\"20\" style=\"vertical-align:middle\" src=\"add-button.png\" onclick=\"DoWLOpenSymbols(" + idxWLMain.toString() + ")\" />" +
                                    "&nbsp;<input id=\"txtwlopen" + sThisId + "\" name=\"txtwlopen" + sThisId + "\" type=\"text\" style=\"width:" + giWLColOpenEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"\">" +
                                    "&nbsp;<input id=\"txtwlacquired" + sThisId + "\" name=\"txtwlacquired" + sThisId + "\" type=\"text\" style=\"width:" + giWLColAcquiredDateEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"" + FormatCurrentDateForTD() + "\"></th>";

                                //"&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLOpenSymbols(" + idxWLMain.toString() + ")\" value=\"Add\" >" +

                                sThisDiv = sThisDiv + "<th style=\"height:30px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:0px;border-color:White\">" +
                                    "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                                    "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" + 
                                    "<span style=\"vertical-align: middle;\" id=\"spanWLDate" + sThisId + "\" name=\"spanWLDate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th >";

                                sThisDiv = sThisDiv + "<th style=\"height:30px; text-align:right;vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                                    "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLCloseSymbol(" + idxWLMain.toString() + ")\" value=\"Update G/L\" >" +
                                    "&nbsp;&dollar;<input id=\"txtwlclose" + sThisId + "\" name=\"txtwlclose" + sThisId + "\" type=\"text\" style=\"width:" + giWLColCloseEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"\"></th>";

                                sThisDiv = sThisDiv + "<th style=\"height:30px;text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";


                                sThisDiv = sThisDiv + "</tr>";

                                sThisDiv = sThisDiv + "<tr>";
                            }

                            sThisDiv = sThisDiv + "<th style=\"text-align:left; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">";
                            sThisDiv = sThisDiv + "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLSell(" + idxWLMain.toString() + ")\" value=\"Sell\" >" +
                                "&nbsp;&nbsp;<input id=\"txtsellpercent" + sThisId + "\" name=\"txtsellpercent" + sThisId + "\" type=\"text\" style=\"width:50px;font-family:Arial,Helvetica, sans-serif; font-size:10pt;\" value=\"\">%";

                            sThisDiv = sThisDiv + "&nbsp;&nbsp;<input type=\"checkbox\" id=\"chksellLimit" + sThisId + "\" name=\"chksellLimit" + sThisId + "\" value=\"\" > Limit";
                            sThisDiv = sThisDiv + "</th>";


                            sThisDiv = sThisDiv + "<th style=\"text-align:center; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">";
                            sThisDiv = sThisDiv + "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLTrailingStop(" + idxWLMain.toString() + ")\" value=\"Trailing Stop\" >" +
                                "&nbsp;&nbsp;<input id=\"txttrailingstoppercent" + sThisId + "\" name=\"txttrailingstoppercent" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:50px\" value=\"\">%";
                            sThisDiv = sThisDiv + "</th>";


                            sThisDiv = sThisDiv + "<th style=\"text-align:right; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">";
                            sThisDiv = sThisDiv + "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLBuy(" + idxWLMain.toString() + ")\" value=\"Buy\" >" +
                                "&nbsp;&nbsp;<input id=\"txtbuypercent" + sThisId + "\" name=\"txtbuypercent" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:50px\" value=\"\">%" +
                                "&nbsp;&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;&nbsp;" +
                                "&dollar;<input id=\"txtbuydollars" + sThisId + "\" name=\"txtbuydollars" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:50px\" value=\"\">";
                            sThisDiv = sThisDiv + "&nbsp;&nbsp;<input type=\"checkbox\" id=\"chkbuyLimit" + sThisId + "\" name=\"chkbuyLimit" + sThisId + "\" value=\"\" > Limit";
                            sThisDiv = sThisDiv + "</th > ";

                            sThisDiv = sThisDiv + "<th style=\"text-align:right; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:1px;border-style:solid;border-spacing:0px;border-color:White\">";
                            sThisDiv = sThisDiv + "&nbsp;";

                            sThisDiv = sThisDiv + "</th > ";

                            sThisDiv = sThisDiv + "</tr>";


                            sThisDiv = sThisDiv + "<tr>";

                            sThisDiv = sThisDiv + "<td colspan=\"4\" style=\"vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";
                        } else { //not using cell

                            if (gWatchlists[idxWLMain].watchlistId == sLastWLAccountId) { //don't show Open and Close if this is an Account watchlist
                                sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                sThisDiv = sThisDiv + "<tr>";

                                sThisDiv = sThisDiv + "<th style=\"height:24.5px; width:" + giWLCol1Width.toString() + "px; vertical-align: middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:0px; border-style:solid; border-spacing:1px; border-color:White\">" +
                                                       "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                                                       "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" + 
                                                       "<span style=\"vertical-align: middle;\" id=\"spanWLDate" + sThisId + "\" name=\"spanWLDate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th >";
                                sThisDiv = sThisDiv + "<th style=\"height:24.5px; width:" + giWLCol2Width.toString() + "px; text-align:right; vertical-align: middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                                sThisDiv = sThisDiv + "</tr>";

                                sThisDiv = sThisDiv + "<tr>";
                                sThisDiv = sThisDiv + "<th colspan=\"2\" style=\"text-align:left; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:1px; border-style:solid;border-spacing:0px;border-color:White\" >";

                            } else {
                                if (bDoingDividendWL) {
                                    sThisDiv = sThisDiv + "<div style=\"width:950px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisDiv = sThisDiv + "<table style=\"width:950px; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                } else {
                                    sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                }
                                sThisDiv = sThisDiv + "<tr>";

                                sThisDiv = sThisDiv + "<th style=\"width:" + (giWLColOpenLabelWidth + giWLColOpenEntryWidth + giWLColAcquiredDateEntryWidth).toString() + "px; text-align:left; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                                    "<img width=\"20\" height=\"20\" style=\"vertical-align:middle\" src=\"delete-button-24px.png\" onclick=\"DoWLDeleteSymbols(" + idxWLMain.toString() + ")\" />" +
                                    "&nbsp;&nbsp;<img width=\"20\" height=\"20\" style=\"vertical-align:middle\" src=\"add-button.png\" onclick=\"DoWLOpenSymbols(" + idxWLMain.toString() + ")\" />" +
                                    "&nbsp;<input id=\"txtwlopen" + sThisId + "\" name=\"txtwlopen" + sThisId + "\" type=\"text\" style=\"width:" + giWLColOpenEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"\">" +
                                    "&nbsp;<input id=\"txtwlacquired" + sThisId + "\" name=\"txtwlacquired" + sThisId + "\" type=\"text\" style=\"width:" + giWLColAcquiredDateEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"" + FormatCurrentDateForTD() + "\"></th>";

                                //"&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLOpenSymbols(" + idxWLMain.toString() + ")\" value=\"Add\" >" +


                                sThisDiv = sThisDiv + "<th style=\"width:" + giWLColTitleWidth.toString() + "px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:0px;border-color:White\">" + 
                                                      "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                                                      "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" + 
                                                      "<span style=\"vertical-align: middle;\" id=\"spanWLDate" + sThisId + "\" name=\"spanWLDate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th >";

                                sThisDiv = sThisDiv + "<th style=\"width:" + (giWLColCloseLabelWidth + giWLColCloseEntryWidth).toString() + "px;text-align:right;vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                                    "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLCloseSymbol(" + idxWLMain.toString() + ")\" value=\"Update G/L\" >" +
                                    "&nbsp;&dollar;<input id=\"txtwlclose" + sThisId + "\" name=\"txtwlclose" + sThisId + "\" type=\"text\" style=\"width:" + giWLColCloseEntryWidth.toString() + "px;font-family:Arial,Helvetica, sans-serif; font-size:10pt; \" value=\"\"></th>";

                                sThisDiv = sThisDiv + "<th style=\"width:" + giWLCol2Width.toString() + "px; text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                                sThisDiv = sThisDiv + "</tr>";

                                sThisDiv = sThisDiv + "<tr>";
                                sThisDiv = sThisDiv + "<th colspan=\"4\" style=\"text-align:left; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:1px; border-style:solid;border-spacing:0px;border-color:White\" >";
                            }

                            sThisDiv = sThisDiv + "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLSell(" + idxWLMain.toString() + ")\" value=\"Sell\" >" +
                                "&nbsp;&nbsp;<input id=\"txtsellpercent" + sThisId + "\" name=\"txtsellpercent" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:30px\" value=\"\">%";

                            sThisDiv = sThisDiv + "&nbsp;&nbsp;<input type=\"checkbox\" id=\"chksellLimit" + sThisId + "\" name=\"chksellLimit" + sThisId + "\" value=\"\" > Limit";


                            sThisDiv = sThisDiv + "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                                "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLTrailingStop(" + idxWLMain.toString() + ")\" value=\"Trailing Stop\" >" +
                                "&nbsp;&nbsp;<input id=\"txttrailingstoppercent" + sThisId + "\" name=\"txttrailingstoppercent" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:30px\" value=\"\">%";


                            sThisDiv = sThisDiv + "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>" +
                                "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLBuy(" + idxWLMain.toString() + ")\" value=\"Buy\" >" +
                                "&nbsp;&nbsp;<input id=\"txtbuypercent" + sThisId + "\" name=\"txtbuypercent" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:30px\" value=\"\">%" +
                                "&nbsp;&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;&nbsp;" +
                                "&dollar;<input id=\"txtbuydollars" + sThisId + "\" name=\"txtbuydollars" + sThisId + "\" type=\"text\" style=\"font-family:Arial,Helvetica, sans-serif; font-size:10pt; width:45px\" value=\"\">";
                            sThisDiv = sThisDiv + "&nbsp;&nbsp;<input type=\"checkbox\" id=\"chkbuyLimit" + sThisId + "\" name=\"chkbuyLimit" + sThisId + "\" value=\"\" > Limit";

                            sThisDiv = sThisDiv + "</th > ";

                            sThisDiv = sThisDiv + "</tr>";


                            sThisDiv = sThisDiv + "<tr>";

                            sThisDiv = sThisDiv + "<td colspan=\"4\" style=\"vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";

                        }


                        sThisDiv = sThisDiv + "<div id=\"divtable" + sThisId + "\" style =\"border-spacing:0px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                        sThisTable = "";
                        sThisTable = sThisTable + "<table style=\"border-collapse:collapse; border: 0px solid black;background-color:" + gsWLTableBackgroundColor + "; width:100%;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                        sThisTable = sThisTable + "<tr>";
                        let sThischkItemId = "chkWLItem" + sThisId + FormatIntegerNumber(idxWLMain, 3, "0") + "000";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\">" +
                            "<input xxthisWillBeReplacedxx style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \" type=\"checkbox\" id=\"" + sThischkItemId + "\" name=\"" + sThischkItemId + "\" value=\"\" onclick=\"wlMarkSelectedItem(" + idxWLMain.toString() + ", " + "-1" + ")\">" +
                            "<span style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \">" +
                            "<b><I>Symbol&nbsp;&nbsp;</I ></b></span></td > ";

                        let sAcquiredSpaces = "";
                        if (bDoingDividendWL) {
                            sAcquiredSpaces = "";
                        }

                        if (bDoingDividendWL) {
                            //doing dividend WL
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Div%</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Div$</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:center;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Div&nbsp;Date</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>P/E</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Price</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Chg(%)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Chg($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Day&nbsp;gain($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Gain($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Gain(%)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Qty</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Cost</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Mkt&nbsp;Value</I></b></td>";

                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Old&nbsp;G/L</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sAcquiredSpaces + "Acquired</I></b></td>";

                        } else {
                            //not doing dividend WL
                            sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Acquired</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Qty</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Price</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Chg(%)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Chg($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Bid</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Ask</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Day&nbsp;gain($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Gain($)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Gain(%)</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Cost</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Old&nbsp;G/L</I></b></td>";
                            sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Mkt&nbsp;Value</I></b></td>";
                        }
                        sThisTable = sThisTable + "</tr>";

                        let dTotalCost = 0.0;
                        let iLineCnt = 0;
                        let dTotalHoldingsGain = 0.0;
                        let dTotalGain = 0.0;
                        let dTotalDayGain = 0.0;
                        for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                            let oWLDisplayed = new WLDisplayed();
                            oWLDisplayed = gWLDisplayed[idxDisplayed];
                            let sSymbol = oWLDisplayed.symbol;
                            let oWLItemDetail = new WLItemDetail();
                            let dCost = 0.0;
                            let dQty = 0.0;
                            if (sSymbolsThisWL.indexOf("," + sSymbol + ",") != -1) {
                                for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                                    oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];
                                    let bOkToShowThisDetail = false;
                                    if ((gWatchlists[idxWLMain].accountId == oWLItemDetail.accountId) ||
                                        (oWLItemDetail.accountId == "")) {
                                        bOkToShowThisDetail = true;
                                    }

                                    if (bOkToShowThisDetail) {
                                        iLineCnt++;
                                        let sCurrentPurchasedDate = "";
                                        let dCurrentAveragePrice = 0.0;
                                        for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                            if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                                sCurrentPurchasedDate = gWatchlists[idxWLMain].WLItems[idxTmp].purchasedDate;
                                                dCurrentAveragePrice = gWatchlists[idxWLMain].WLItems[idxTmp].priceInfo.averagePrice;
                                                break;
                                            }
                                        }

                                        let sChecked = "";
                                        let sThisidxWLItem = "";
                                        let idxThisSymbol = sSymbolsSelectedForOrderThisWL.indexOf("|" + sSymbol + ",");
                                        let idxThisSymbolidxWLItem = sSymbolsSelectedForOrderThisWL.substring(idxThisSymbol + 1, sSymbolsSelectedForOrderThisWL.length - 1).indexOf(",");
                                        let idxThisSymbolselected = sSymbolsSelectedForOrderThisWL.substring(idxThisSymbolidxWLItem + idxThisSymbol + 2, sSymbolsSelectedForOrderThisWL.length - 1).indexOf(",");
                                        sThisidxWLItem = sSymbolsSelectedForOrderThisWL.substr(idxThisSymbol + idxThisSymbolidxWLItem + 2, idxThisSymbolselected);


                                        if (sSymbolsSelectedForOrderThisWL.substr(idxThisSymbol + idxThisSymbolidxWLItem + idxThisSymbolselected + 3, 4).toUpperCase() == "TRUE") {
                                            sChecked = "checked";
                                        } else {
                                            bEverythingIsChecked = false;
                                        }

                                        let sThisTRId = "TR" + sThisId + FormatIntegerNumber(idxWLMain, 3, "0") + FormatIntegerNumber(parseInt(sThisidxWLItem), 3, "0");
                                        if (sChecked == "checked") {
                                            sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableSelectedRowBackgroundColor + ";\">";
                                        } else {
                                            if ((iLineCnt % 2) == 0) {
                                                sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableEvenRowBackgroundColor + ";\">";
                                            } else {
                                                sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableOddRowBackgroundColor + ";\">";
                                            }
                                        }

                                        sTmp = "";
                                        //for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                        //    if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                        //        sTmp = "&nbsp;(" + gWatchlists[idxWLMain].WLItems[idxTmp].sequenceId + ")";
                                        //        break;
                                        //    }
                                        //}

                                        let sThischkItemId = "chkWLItem" + sThisId + FormatIntegerNumber(idxWLMain, 3, "0") + FormatIntegerNumber(parseInt(sThisidxWLItem), 3, "0");
                                        sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" +
                                            "<input style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";\" id=\"" + sThischkItemId + "\" name=\"" + sThischkItemId + "\" type=\"checkbox\" " + sChecked + " value=\"\" onclick=\"wlMarkSelectedItem(" + idxWLMain.toString() + ", " + sThisidxWLItem + ")\">" +
                                            "<span style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \">" +
                                            sSymbol + sTmp +  "</span></td>";

                                        if ((isUndefined(goWLDisplayed)) || (isUndefined(goWLDisplayed[sThisId + sSymbol]))) {
                                            let oT = {
                                                "symbol": sSymbol,
                                                "assetType": oWLDisplayed.assetType,
                                                "accountId": sLastWLAccountId,
                                                "accountName": "",
                                                "purchasedDate": sCurrentPurchasedDate,
                                                "askPrice": oWLItemDetail.askPrice,
                                                "bidPrice": oWLItemDetail.bidPrice,
                                                "highPrice": oWLItemDetail.highPrice,
                                                "lowPrice": oWLItemDetail.lowPrice,
                                                "lastPrice": oWLItemDetail.lastPrice,
                                                "netChange": oWLItemDetail.netChange,
                                                "netPercentChangeInDouble": oWLItemDetail.netPercentChangeInDouble,
                                                "regularMarketLastPrice": oWLItemDetail.regularMarketLastPrice,
                                                "regularMarketNetChange": oWLItemDetail.regularMarketNetChange,
                                                "regularMarketPercentChangeInDouble": oWLItemDetail.regularMarketPercentChangeInDouble,
                                                "shares": oWLItemDetail.shares,
                                                "dayGain": oWLItemDetail.dayGain,
                                                "costPerShare": oWLItemDetail.costPerShare,
                                                "marketValue": oWLItemDetail.marketValue,
                                                "gain": oWLItemDetail.gain,
                                                "gainPercent": oWLItemDetail.gainPercent,
                                                "averagePrice": dCurrentAveragePrice,
                                                "peRatio": oWLItemDetail.peRatio,
                                                "divAmount": oWLItemDetail.divAmount,
                                                "divDate": oWLItemDetail.divDate,
                                                "divYield": oWLItemDetail.divYield
                                            }
                                            goWLDisplayed[sThisId + sSymbol] = oT;
                                        }

                                        if (bDoingDividendWL) {
                                            //Div Yield
                                            sTmp = FormatDecimalNumber(oWLItemDetail.divYield, 5, 2, "") + "%";
                                            if (goWLDisplayed[sThisId + sSymbol].divYield == oWLItemDetail.divYield) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                goWLDisplayed[sThisId + sSymbol].divYield = oWLItemDetail.divYield;
                                            }

                                            //Div Amount
                                            sTmp = "&nbsp;&nbsp;" + FormatDecimalNumber(oWLItemDetail.divAmount, 5, 2, "");
                                            if (goWLDisplayed[sThisId + sSymbol].divAmount == oWLItemDetail.divAmount) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                goWLDisplayed[sThisId + sSymbol].divAmount = oWLItemDetail.divAmount;
                                            }

                                            //Div Date
                                            sTmp = oWLItemDetail.divDate;
                                            if (sTmp != "") {
                                                sTmp = "&nbsp;&nbsp;&nbsp;&nbsp;" + sTmp.split(" ")[0];
                                            }
                                            if (goWLDisplayed[sThisId + sSymbol].divDate == oWLItemDetail.divDate) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                goWLDisplayed[sThisId + sSymbol].divDate = oWLItemDetail.divDate;
                                            }

                                            //P/E
                                            sTmp = FormatDecimalNumber(oWLItemDetail.peRatio, 5, 0, "");
                                            if (goWLDisplayed[sThisId + sSymbol].peRatio == oWLItemDetail.peRatio) {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                                goWLDisplayed[sThisId + sSymbol].peRatio = oWLItemDetail.peRatio;
                                            }
                                        }

                                        if (!bDoingDividendWL) {
                                            //Acquired
                                            sTmp = "";
                                            for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                                if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                                    sTmp = gWatchlists[idxWLMain].WLItems[idxTmp].purchasedDate;
                                                    break;
                                                }
                                            }
                                            if (goWLDisplayed[sThisId + sSymbol].purchasedDate == sTmp) {
                                                if (sTmp == "") {
                                                    sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + "&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + sTmp + "</td>";
                                                }
                                            } else {
                                                if (sTmp == "") {
                                                    sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + "&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sAcquiredSpaces + sTmp + "</b></td>";
                                                }
                                                goWLDisplayed[sThisId + sSymbol].purchasedDate = sTmp;
                                            }
                                        }

                                        //Qty
                                        sTmp = FormatDecimalNumber(oWLItemDetail.shares, 5, 0, "");
                                        dQty = parseFloat(sTmp);

                                        if (!bDoingDividendWL) {
                                            if (dQty == 0.0) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                goWLDisplayed[sThisId + sSymbol].shares = dQty;
                                            } else {
                                                if (goWLDisplayed[sThisId + sSymbol].shares == sTmp) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                    goWLDisplayed[sThisId + sSymbol].shares = dQty;
                                                }
                                            }

                                        }

                                        sTmp = FormatDecimalNumber(oWLItemDetail.regularMarketLastPrice, 5, 2, "");
                                        if (goWLDisplayed[sThisId + sSymbol].regularMarketLastPrice == oWLItemDetail.regularMarketLastPrice) {
                                            sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                        } else {
                                            sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            goWLDisplayed[sThisId + sSymbol].regularMarketLastPrice = oWLItemDetail.regularMarketLastPrice;
                                        }

                                        sTmp = FormatDecimalNumber(oWLItemDetail.regularMarketPercentChangeInDouble, 5, 2, "") + "%";
                                        if (goWLDisplayed[sThisId + sSymbol].regularMarketPercentChangeInDouble == oWLItemDetail.regularMarketPercentChangeInDouble) {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                        } else {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                            goWLDisplayed[sThisId + sSymbol].regularMarketPercentChangeInDouble = oWLItemDetail.regularMarketPercentChangeInDouble;
                                        }

                                        sTmp = FormatDecimalNumber(oWLItemDetail.regularMarketNetChange, 5, 2, "");
                                        if (goWLDisplayed[sThisId + sSymbol].regularMarketNetChange == oWLItemDetail.regularMarketNetChange) {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                        } else {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                            goWLDisplayed[sThisId + sSymbol].regularMarketNetChange = oWLItemDetail.regularMarketNetChange;
                                        }

                                        if (!bDoingDividendWL) {
                                            sTmp = FormatDecimalNumber(oWLItemDetail.bidPrice, 5, 2, "");
                                            if (goWLDisplayed[sThisId + sSymbol].bidPrice == oWLItemDetail.bidPrice) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                goWLDisplayed[sThisId + sSymbol].bidPrice = oWLItemDetail.bidPrice;
                                            }

                                            sTmp = FormatDecimalNumber(oWLItemDetail.askPrice, 5, 2, "");
                                            if (goWLDisplayed[sThisId + sSymbol].askPrice == oWLItemDetail.askPrice) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                goWLDisplayed[sThisId + sSymbol].askPrice = oWLItemDetail.askPrice;
                                            }
                                        }

                                        sTmp = FormatDecimalNumber(oWLItemDetail.dayGain, 5, 2, "");
                                        dTotalDayGain = dTotalDayGain + parseFloat(sTmp);
                                        if (goWLDisplayed[sThisId + sSymbol].dayGain == oWLItemDetail.dayGain) {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsDownDay++;
                                                }
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsUpDay++;
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                //if (oWLItemDetail.shares > 0.0) {
                                                //    iTotalSymbolsUpDay++;
                                                //}
                                            }
                                        } else {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsDownDay++;
                                                }
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsUpDay++;
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                //if (oWLItemDetail.shares > 0.0) {
                                                //    iTotalSymbolsUpDay++;
                                                //}
                                            }
                                            goWLDisplayed[sThisId + sSymbol].dayGain = oWLItemDetail.dayGain;
                                        }

                                        sTmp = FormatDecimalNumber(oWLItemDetail.gain, 5, 2, "");
                                        if (goWLDisplayed[sThisId + sSymbol].gain == oWLItemDetail.gain) {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsDown++;
                                                }
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsUp++;
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                //if (oWLItemDetail.shares > 0.0) {
                                                //    iTotalSymbolsUp++;
                                                //}
                                            }
                                        } else {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsDown++;
                                                }
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                if (oWLItemDetail.shares > 0.0) {
                                                    iTotalSymbolsUp++;
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                //if (oWLItemDetail.shares > 0.0) {
                                                //    iTotalSymbolsUp++;
                                                //}
                                            }
                                            goWLDisplayed[sThisId + sSymbol].gain = oWLItemDetail.gain;
                                        }
                                        dTotalGain = dTotalGain + parseFloat(sTmp);
                                        dTotalHoldingsGain = dTotalHoldingsGain + parseFloat(sTmp);

                                        sTmp = FormatDecimalNumber(oWLItemDetail.gainPercent, 5, 2, "") + "%";
                                        if (goWLDisplayed[sThisId + sSymbol].gainPercent == oWLItemDetail.gainPercent) {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                        } else {
                                            if (parseFloat(sTmp) < 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else if (parseFloat(sTmp) > 0.0) {
                                                sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            }
                                            goWLDisplayed[sThisId + sSymbol].gainPercent = oWLItemDetail.gainPercent;
                                        }

                                        if (bDoingDividendWL) {
                                            sTmp = FormatDecimalNumber(oWLItemDetail.shares, 5, 0, "");
                                            dQty = parseFloat(sTmp);
                                            if (dQty == 0.0) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                goWLDisplayed[sThisId + sSymbol].shares = dQty;
                                            } else {
                                                if (goWLDisplayed[sThisId + sSymbol].shares == sTmp) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                    goWLDisplayed[sThisId + sSymbol].shares = dQty;
                                                }
                                            }

                                        }

                                        //Cost
                                        sTmp = FormatDecimalNumber(oWLItemDetail.costPerShare, 5, 2, "");
                                        dCost = parseFloat(sTmp);
                                        if (goWLDisplayed[sThisId + sSymbol].costPerShare == oWLItemDetail.costPerShare) {
                                            if (dCost == 0.0) {
                                                if (dQty == 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">???</td>";
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            }
                                        } else {
                                            if (dCost == 0.0) {
                                                if (dQty == 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>???</b></td>";
                                                }
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            }
                                            goWLDisplayed[sThisId + sSymbol].costPerShare = oWLItemDetail.costPerShare;
                                        }
                                        dTotalCost = dTotalCost + (dCost * dQty);

                                        if (!bDoingDividendWL) {
                                            //Old G/L
                                            let dTmpOrig = 0.0;
                                            for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                                if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                                    dTmpOrig = gWatchlists[idxWLMain].WLItems[idxTmp].priceInfo.averagePrice;
                                                    break;
                                                }
                                            }
                                            sTmp = FormatDecimalNumber(dTmpOrig, 5, 2, "");
                                            let dTmp = parseFloat(sTmp);
                                            dTotalGain = dTotalGain + dTmp;
                                            if (dTmp == 0) {
                                                sTmp = "";
                                            }
                                            if (goWLDisplayed[sThisId + sSymbol].averagePrice == dTmpOrig) {
                                                if (dTmp < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else if (dTmp > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                            } else {
                                                if (dTmp < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else if (dTmp > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                                goWLDisplayed[sThisId + sSymbol].averagePrice = dTmpOrig;
                                            }

                                        }

                                        //Mkt Value
                                        sTmp = FormatDecimalNumber(oWLItemDetail.marketValue, 5, 2, "");
                                        if (goWLDisplayed[sThisId + sSymbol].marketValue == oWLItemDetail.marketValue) {
                                            if (parseFloat(sTmp) == 0.0) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                            }
                                        } else {
                                            if (parseFloat(sTmp) == 0.0) {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                            }
                                            goWLDisplayed[sThisId + sSymbol].marketValue = oWLItemDetail.marketValue;
                                        }

                                        if (bDoingDividendWL) {

                                            //Old G/L
                                            let dTmpOrig = 0.0;
                                            for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                                if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                                    dTmpOrig = gWatchlists[idxWLMain].WLItems[idxTmp].priceInfo.averagePrice;
                                                    break;
                                                }
                                            }
                                            sTmp = FormatDecimalNumber(dTmpOrig, 5, 2, "");
                                            let dTmp = parseFloat(sTmp);
                                            dTotalGain = dTotalGain + dTmp;
                                            if (dTmp == 0) {
                                                sTmp = "";
                                            }
                                            if (goWLDisplayed[sThisId + sSymbol].averagePrice == dTmpOrig) {
                                                if (dTmp < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else if (dTmp > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                            } else {
                                                if (dTmp < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else if (dTmp > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                                }
                                                goWLDisplayed[sThisId + sSymbol].averagePrice = dTmpOrig;
                                            }

                                            //Acquired
                                            sTmp = "";
                                            for (let idxTmp = 0; idxTmp < gWatchlists[idxWLMain].WLItems.length; idxTmp++) {
                                                if (gWatchlists[idxWLMain].WLItems[idxTmp].symbol == sSymbol) {
                                                    sTmp = gWatchlists[idxWLMain].WLItems[idxTmp].purchasedDate;
                                                    break;
                                                }
                                            }
                                            if (goWLDisplayed[sThisId + sSymbol].purchasedDate == sTmp) {
                                                if (sTmp == "") {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + "&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + sTmp + "</td>";
                                                }
                                            } else {
                                                if (sTmp == "") {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAcquiredSpaces + "&nbsp;</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sAcquiredSpaces + sTmp + "</b></td>";
                                                }
                                                goWLDisplayed[sThisId + sSymbol].purchasedDate = sTmp;
                                            }
                                        }

                                        sThisTable = sThisTable + "</tr>";
                                        //    iLineCnt++;
                                    }
                                }
                            }

                        }
                        if (sThisTable != "") {
                            let sPrecedingSpaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            if (sLastWLName == "Account") {
                                sPrecedingSpaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            }

                            if (bDoingDividendWL) {
                                sThisTable = sThisTable + "<tr><td colspan=\"16\" style=\"height:30px; text-align:center;vertical-align:middle;border-top-width:1px; border-bottom-width:0px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:1px;border-color:Black\"><b>";
                            } else {
                                sThisTable = sThisTable + "<tr><td colspan=\"14\" style=\"height:30px; text-align:center;vertical-align:middle;border-top-width:1px; border-bottom-width:0px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:1px;border-color:Black\"><b>";
                            }
                            if (iLineCnt != gWatchlists[idxWLMain].WLItems.length) {
                                //debugger
                                return;
                                sThisTable = sThisTable + "<I>*Day</I>";
                            } else {
                                sThisTable = sThisTable + "<I>Day</I>";
                            }
                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;Up:&nbsp;<span style=\"color:green\">" + iTotalSymbolsUpDay.toString() + "</span>";
                            sThisTable = sThisTable + "&nbsp;&nbsp;Down:&nbsp;<span style=\"color:" + gsNegativeColor + "\">" + iTotalSymbolsDownDay.toString() + "</span>";
                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;Cost:&nbsp;";
                            sTmp = FormatDecimalNumber(dTotalCost, 5, 2, "");
                            sThisTable = sThisTable + sTmp;

                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;G/L:&nbsp;";
                            sTmp = FormatDecimalNumber(dTotalDayGain, 5, 2, "");
                            if (dTotalDayGain < 0.0) {
                                sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "</span>";
                            } else {
                                sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "</span>";
                            }
                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;&nbsp;";
                            if (dTotalCost == 0) {
                                sTmp = "0.00";
                            } else {
                                sTmp = FormatDecimalNumber((dTotalDayGain / dTotalCost) * 100, 5, 2, "");
                            }
                            if (dTotalDayGain < 0.0) {
                                sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "%</span>";
                            } else {
                                sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "%</span>";
                            }


                            sThisTable = sThisTable + sPrecedingSpaces + "<I>Holding</I>&nbsp;G/L:&nbsp;";
                            sTmp = FormatDecimalNumber(dTotalHoldingsGain, 5, 2, "");
                            if (dTotalHoldingsGain < 0.0) {
                                sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "</span>";
                            } else {
                                sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "</span>";
                            }
                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;&nbsp;";
                            if (dTotalCost == 0) {
                                sTmp = "0.00";
                            } else {
                                sTmp = FormatDecimalNumber((dTotalHoldingsGain / dTotalCost) * 100, 5, 2, "");
                            }
                            if (dTotalHoldingsGain < 0.0) {
                                sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "%</span>";
                            } else {
                                sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "%</span>";
                            }
                            if (sLastWLName == "Account") {
                                for (let idxAccount = 0; idxAccount < gAccounts.length; idxAccount++) {
                                    if (gWatchlists[idxWLMain].accountId == gAccounts[idxAccount].accountId) {
                                        //this.IBliquidationValue = 0.0;
                                        //this.CBliquidationValue = 0.0;
                                        //this.CBcashBalance = 0.0;
                                        if (gAccounts[idxAccount].CBliquidationValue != 0) {
                                            sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;Cash:&nbsp;";
                                            let dCashPercentage = gAccounts[idxAccount].CBcashBalance / gAccounts[idxAccount].CBliquidationValue;
                                            sTmp = FormatDecimalNumber(dCashPercentage * 100, 5, 2, "");
                                            if (dCashPercentage < 0.0) {
                                                sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "%</span>";
                                            } else {
                                                sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "%</span>";
                                            }

                                            sThisTable = sThisTable + sPrecedingSpaces + "<I>Account</I>";
                                            sThisTable = sThisTable + "&nbsp;&nbsp;Up:&nbsp;<span style=\"color:green\">" + iTotalSymbolsUp.toString() + "</span>";
                                            sThisTable = sThisTable + "&nbsp;&nbsp;Down:&nbsp;<span style=\"color:" + gsNegativeColor + "\">" + iTotalSymbolsDown.toString() + "</span>";
                                        }
                                    }
                                }
                            } else {
                                sThisTable = sThisTable + sPrecedingSpaces + "<I>Portfolio</I>";
                                sThisTable = sThisTable + "&nbsp;&nbsp;G/L:&nbsp;";
                                sTmp = FormatDecimalNumber(dTotalGain, 5, 2, "");
                                if (dTotalGain < 0.0) {
                                    sThisTable = sThisTable + "<span style=\"color:" + gsNegativeColor + ";\">" + sTmp + "</span>";
                                } else {
                                    sThisTable = sThisTable + "<span style=\"color:green;\">" + sTmp + "</span>";
                                }
                                sThisTable = sThisTable + "&nbsp;&nbsp;&nbsp;Up:&nbsp;<span style=\"color:green\">" + iTotalSymbolsUp.toString() + "</span>";
                                sThisTable = sThisTable + "&nbsp;&nbsp;Down:&nbsp;<span style=\"color:" + gsNegativeColor + "\">" + iTotalSymbolsDown.toString() + "</span>";
                            }

                            sThisTable = sThisTable + "<b></td></tr>";

                            sThisTable = sThisTable + "</table>";
                            if (bEverythingIsChecked) {
                                sThisTable = sThisTable.replace("xxthisWillBeReplacedxx", "checked");
                            }

                            sThisDiv = sThisDiv + sThisTable + "</div ></td ></tr ></table ></div > ";
                        }
                        if (gWatchlists[idxWLMain].spanName == "") {
                            gWatchlists[idxWLMain].spanName = gWatchlists[idxWLMain].watchlistId + gWatchlists[idxWLMain].accountId;
                            sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWLMain].spanName);
                            wlAddDiv(gWatchlists[idxWLMain].spanName, sThisDiv);
                        } else {
                            if (document.getElementById(gWatchlists[idxWLMain].spanName).innerHTML == "") {
                                sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWLMain].spanName);
                                document.getElementById(gWatchlists[idxWLMain].spanName).innerHTML = sThisDiv;
                            } else {
                                document.getElementById("divtable" + sThisId).innerHTML = sThisTable;
                                document.getElementById("spanWLDate" + sThisId).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + sDate;
                            }
                        }
                    } else {
                        //no symbols found for the selected watchlist 
                        sThisDiv = "";
                        sLastWLName = gWatchlists[idxWLMain].name;
                        sLastWLAccountName = gWatchlists[idxWLMain].accountName;
                        sThisDiv = sThisDiv + "<div style=\"width:800px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                        sThisDiv = sThisDiv + "<table style=\"width:100%; border-width:1px; border-style:solid;border-spacing:1px;border-color:White;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                        sThisDiv = sThisDiv + "<tr>";
                        sThisDiv = sThisDiv + "<th style=\"width:780px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:0px; border-style:solid;border-spacing:1px;border-color:White\"><b>Watchlist -- " + sLastWLAccountName + "--" + sLastWLName + "</b></th>";
                        sThisDiv = sThisDiv + "<th style=\"width:18px; text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid;border-spacing:1px;border-color:White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">X&nbsp;&nbsp;</th>";
                        //                                                            sThisDiv = sThisDiv + "<th style=\"width:100%; vertical-align:top; border-width:1px; border-style:solid;border-spacing:1px;border-color:White\"><b>Watchlist -- " + sLastWLAccountName + "--" + sLastWLName + "</b></th>";
                        sThisDiv = sThisDiv + "</tr>";
                        sThisDiv = sThisDiv + "<tr>";
                        sThisDiv = sThisDiv + "<td style=\"width:100%; vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";
                        sThisDiv = sThisDiv + "<div style=\"font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                        sThisDiv = sThisDiv + "<table style=\"width:100%;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                        sThisDiv = sThisDiv + "<tr>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:left;vertical-align:top;border-width:0px;\"><I>Symbol&nbsp;&nbsp;</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:left;vertical-align:top;border-width:0px;\"><I>Acct&nbsp;&nbsp;</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Qty</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Price</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Chg(%)</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Chg($)</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;&nbsp;Bid</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;&nbsp;Ask</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;Day gain($)</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Gain($)</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Gain(%)</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Cost</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Old&nbsp;G/L</I></td>";
                        sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Mkt&nbsp;Value</I></td>";

                        sThisDiv = sThisDiv + "</tr>";

                        sThisDiv = sThisDiv + "</table></div></td></tr></table></div>";
                        if (gWatchlists[idxWLMain].spanName == "") {
                            gWatchlists[idxWLMain].spanName = gWatchlists[idxWLMain].watchlistId + gWatchlists[idxWLMain].accountId;
                            wlAddDiv(gWatchlists[idxWLMain].spanName, sThisDiv);
                        } else {
                            document.getElementById(gWatchlists[idxWLMain].spanName).innerHTML = sThisDiv;
                        }
                    }
                } else {
                    //no symbols found for the selected watchlist 
                    sThisDiv = "";
                    sLastWLName = gWatchlists[idxWLMain].name;
                    sLastWLAccountName = gWatchlists[idxWLMain].accountName;
                    sThisDiv = sThisDiv + "<div style=\"width:800px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                    sThisDiv = sThisDiv + "<table style=\"width:100%; border-width:1px; border-style:solid;border-spacing:1px;border-color:White;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                    sThisDiv = sThisDiv + "<tr>";
                    sThisDiv = sThisDiv + "<th style=\"width:780px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:0px; border-style:solid;border-spacing:1px;border-color:White\"><b>Watchlist -- " + sLastWLAccountName + "--" + sLastWLName + "</b></th>";
                    sThisDiv = sThisDiv + "<th style=\"width:18px; text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid;border-spacing:1px;border-color:White\" onclick=\"wlDoRemoveDiv(" + idxWLMain.toString() + ")\">X&nbsp;&nbsp;</th>";
                    //                                                            sThisDiv = sThisDiv + "<th style=\"width:100%; vertical-align:top; border-width:1px; border-style:solid;border-spacing:1px;border-color:White\"><b>Watchlist -- " + sLastWLAccountName + "--" + sLastWLName + "</b></th>";
                    sThisDiv = sThisDiv + "</tr>";
                    sThisDiv = sThisDiv + "<tr>";
                    sThisDiv = sThisDiv + "<td style=\"width:100%; vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";
                    sThisDiv = sThisDiv + "<div style=\"font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                    sThisDiv = sThisDiv + "<table style=\"width:100%;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                    sThisDiv = sThisDiv + "<tr>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:left;vertical-align:top;border-width:0px;\"><I>Symbol&nbsp;&nbsp;</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:left;vertical-align:top;border-width:0px;\"><I>Acct&nbsp;&nbsp;</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Qty</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Price</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Chg(%)</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Chg($)</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;&nbsp;Bid</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;&nbsp;Ask</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;Day gain($)</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Gain($)</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:top;border-width:0px;\"><I>&nbsp;&nbsp;&nbsp;Gain(%)</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Cost</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Old&nbsp;G/L</I></td>";
                    sThisDiv = sThisDiv + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><I>Mkt&nbsp;Value</I></td>";

                    sThisDiv = sThisDiv + "</tr>";

                    sThisDiv = sThisDiv + "</table></div></td></tr></table></div>";
                    if (gWatchlists[idxWLMain].spanName == "") {
                        gWatchlists[idxWLMain].spanName = gWatchlists[idxWLMain].watchlistId + gWatchlists[idxWLMain].accountId;
                        wlAddDiv(gWatchlists[idxWLMain].spanName, sThisDiv);
                    } else {
                        document.getElementById(gWatchlists[idxWLMain].spanName).innerHTML = sThisDiv;
                    }
                }
            }
        }
    }
}

function GetWatchlists(bDoingReset) {
    let sWLExclusionList = ",DEFAULT,EVERYTHING,INDEXES,"

    let oCMLength = oCMWL.length;
    let oOldWL = new Array();
    if (oCMLength > 0) {
        if (bDoingReset) {
            for (let idxWLCur = 0; idxWLCur < gWatchlists.length; idxWLCur++) {
                oOldWL[oOldWL.length] = gWatchlists[idxWLCur]
            }
            gWatchlists.length = 0;
            for (let idxWL = 0; idxWL < oCMLength; idxWL++) {
                let oWL = new WLWatchList();
                oWL.accountId = oCMWL[idxWL].accountId;
                oWL.watchlistId = oCMWL[idxWL].watchlistId
                oWL.name = oCMWL[idxWL].name;
                if (sWLExclusionList.indexOf("," + UnReplace_XMLChar(oWL.name).toUpperCase() + ",") == -1) {
                    if (gAccounts.length > 0) {
                        for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                            if (oWL.accountId == gAccounts[idxAccounts].accountId) {
                                oWL.accountName = gAccounts[idxAccounts].accountName;
                                break;
                            }
                        }
                    }
                    if (!isUndefined(oCMWL[idxWL].watchlistItems)) {
                        if (oCMWL[idxWL].watchlistItems.length > 0) {
                            let sSymbolsFound = ",";
                            for (let idxWLItem = 0; idxWLItem < oCMWL[idxWL].watchlistItems.length; idxWLItem++) {
                                if (sSymbolsFound.indexOf("," + oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol + ",") == -1) {
                                    sSymbolsFound = sSymbolsFound + oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol + ",";
                                    let oWLItem = new WLItem();
                                    oWLItem.assetType = oCMWL[idxWL].watchlistItems[idxWLItem].instrument.assetType;
                                    oWLItem.symbol = oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol;
                                    oWLItem.sequenceId = oCMWL[idxWL].watchlistItems[idxWLItem].sequenceId;
                                    if (!isUndefined(oCMWL[idxWL].watchlistItems[idxWLItem].purchasedDate)) {
                                        oWLItem.purchasedDate = oCMWL[idxWL].watchlistItems[idxWLItem].purchasedDate;
                                    }
                                    oWLItem.priceInfo.averagePrice = oCMWL[idxWL].watchlistItems[idxWLItem].commission;
                                    if (oWLItem.priceInfo.averagePrice > 1000000.0) {
                                        oWLItem.priceInfo.averagePrice = -1 * (oWLItem.priceInfo.averagePrice - 1000000.0);
                                    }
                                    oWL.WLItems[oWL.WLItems.length] = oWLItem;
                                }
                            }
                            oWL.WLItems.sort(sortBySymbol);
                        }
                    }
                    for (let idxWLCur = 0; idxWLCur < oOldWL.length; idxWLCur++) {
                        if ((oWL.accountId == oOldWL[idxWLCur].accountId) &&
                            (oWL.name == oOldWL[idxWLCur].name)) {
                            oWL.spanName = oOldWL[idxWLCur].spanName;
                            if (oOldWL[idxWLCur].bSelected) {
                                oWL.bSelected = true;
                                oWL.bSelectedTemp = true;

                                // now reset the selected for order flag
                                if (oWL.WLItems.length > 0) {
                                    if (oOldWL[idxWLCur].WLItems.length > 0) {
                                        for (let idxWLItem = 0; idxWLItem < oWL.WLItems.length; idxWLItem++) {
                                            for (let idxWLItemOld = 0; idxWLItemOld < oOldWL[idxWLCur].WLItems.length; idxWLItemOld++) {
                                                if ((oOldWL[idxWLCur].WLItems[idxWLItemOld].symbol == oWL.WLItems[idxWLItem].symbol) &&
                                                    (oOldWL[idxWLCur].WLItems[idxWLItemOld].accountId == oWL.WLItems[idxWLItem].accountId)) {
                                                    oWL.WLItems[idxWLItem].bSelectedForOrder = oOldWL[idxWLCur].WLItems[idxWLItemOld].bSelectedForOrder;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                    gWatchlists[gWatchlists.length] = oWL;
                }
            }
        } else {
            for (let idxWLCur = 0; idxWLCur < gWatchlists.length; idxWLCur++) {
                oOldWL[oOldWL.length] = gWatchlists[idxWLCur]
            }
            gWatchlists.length = 0;
            for (let idxWL = 0; idxWL < oCMLength; idxWL++) {
                let oWL = new WLWatchList();
                oWL.accountId = oCMWL[idxWL].accountId;
                oWL.watchlistId = oCMWL[idxWL].watchlistId
                oWL.name = oCMWL[idxWL].name;
                if (sWLExclusionList.indexOf("," + UnReplace_XMLChar(oWL.name).toUpperCase() + ",") == -1) {
                    if (gAccounts.length > 0) {
                        for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                            if (oWL.accountId == gAccounts[idxAccounts].accountId) {
                                oWL.accountName = gAccounts[idxAccounts].accountName;
                                break;
                            }
                        }
                    }
                    if (!isUndefined(oCMWL[idxWL].watchlistItems)) {
                        if (oCMWL[idxWL].watchlistItems.length > 0) {
                            let sSymbolsFound = ",";
                            for (let idxWLItem = 0; idxWLItem < oCMWL[idxWL].watchlistItems.length; idxWLItem++) {
                                if (sSymbolsFound.indexOf("," + oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol + ",") == -1) {
                                    sSymbolsFound = sSymbolsFound + oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol + ",";
                                    let oWLItem = new WLItem();
                                    oWLItem.assetType = oCMWL[idxWL].watchlistItems[idxWLItem].instrument.assetType;
                                    oWLItem.symbol = oCMWL[idxWL].watchlistItems[idxWLItem].instrument.symbol;
                                    oWLItem.sequenceId = oCMWL[idxWL].watchlistItems[idxWLItem].sequenceId;
                                    if (!isUndefined(oCMWL[idxWL].watchlistItems[idxWLItem].purchasedDate)) {
                                        oWLItem.purchasedDate = oCMWL[idxWL].watchlistItems[idxWLItem].purchasedDate;
                                    }
                                    oWLItem.priceInfo.averagePrice = oCMWL[idxWL].watchlistItems[idxWLItem].commission;
                                    if (oWLItem.priceInfo.averagePrice > 1000000.0) {
                                        oWLItem.priceInfo.averagePrice = -1 * (oWLItem.priceInfo.averagePrice - 1000000.0);
                                    }
                                    oWL.WLItems[oWL.WLItems.length] = oWLItem;
                                }
                            }
                            oWL.WLItems.sort(sortBySymbol);
                        }
                    }
                    gWatchlists[gWatchlists.length] = oWL;
                }
            }
        }

        //add an Account Watchlist Summary for each account that has a watchlist
        if (gAccounts.length > 0) {
            for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                oAccount = new Account();
                oAccount = gAccounts[idxAccounts];

                if (gWatchlists.length > 0) {
                    for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                        if ((gWatchlists[idxWL].accountId == oAccount.accountId) &&
                            (gWatchlists[idxWL].name.toUpperCase().indexOf("DIVIDEND") == -1) ) {
                            let oWL = new WLWatchList();
                            oWL.accountId = oAccount.accountId;
                            oWL.accountName = oAccount.accountName;
                            oWL.watchlistId = oAccount.accountId + "AccountWLSummary";
                            oWL.name = gsAccountWLSummary;
                            gWatchlists[gWatchlists.length] = oWL;
                            break;
                        }
                    }
                }
            }
        }

        //add an Account watchlist for each account that has stock positions
        if (gAccounts.length > 0) {
            for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                let bAddWLForThisAccount = false;
                oAccount = new Account();
                oAccount = gAccounts[idxAccounts];
                if (oAccount.positions.length > 0) {
                    for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                        let oPosition = new Position();
                        oPosition = oAccount.positions[idxPosition];
                        if (oPosition.assetType == "EQUITY") {
                            bAddWLForThisAccount = true;
                            break;
                        }
                    }
                    if (bAddWLForThisAccount) {
                        let oWL = new WLWatchList();
                        oWL.accountId = oAccount.accountId;
                        oWL.accountName = oAccount.accountName;
                        oWL.watchlistId = oAccount.accountId;
                        oWL.name = "Account";
                        for (let idxPosition = 0; idxPosition < oAccount.positions.length; idxPosition++) {
                            let oPosition = new Position();
                            oPosition = oAccount.positions[idxPosition];
                            if (oPosition.assetType == "EQUITY") {
                                let oWLItem = new WLItem();
                                oWLItem.assetType = oPosition.assetType;
                                oWLItem.symbol = oPosition.symbol;
                                oWLItem.sequenceId = oWL.WLItems.length + 1;
                                //oWLItem.priceInfo.averagePrice = oPosition.averagePrice;
                                oWL.WLItems[oWL.WLItems.length] = oWLItem;
                            }
                        }
                        oWL.WLItems.sort(sortBySymbol);
                        if (bDoingReset) {
                            //check to see if the Account watchlist has been selected
                            for (let idxWLCur = 0; idxWLCur < oOldWL.length; idxWLCur++) {
                                if ((oWL.accountId == oOldWL[idxWLCur].accountId) &&
                                    (oWL.name == oOldWL[idxWLCur].name)) {
                                    oWL.spanName = oOldWL[idxWLCur].spanName;
                                    if (oOldWL[idxWLCur].bSelected) {
                                        oWL.bSelected = true;
                                        oWL.bSelectedTemp = true;

                                        // now reset the selected for order flag
                                        if (oWL.WLItems.length > 0) {
                                            if (oOldWL[idxWLCur].WLItems.length > 0) {
                                                for (let idxWLItem = 0; idxWLItem < oWL.WLItems.length; idxWLItem++) {
                                                    for (let idxWLItemOld = 0; idxWLItemOld < oOldWL[idxWLCur].WLItems.length; idxWLItemOld++) {
                                                        if ((oOldWL[idxWLCur].WLItems[idxWLItemOld].symbol == oWL.WLItems[idxWLItem].symbol) &&
                                                            (oOldWL[idxWLCur].WLItems[idxWLItemOld].accountId == oWL.WLItems[idxWLItem].accountId)) {
                                                            oWL.WLItems[idxWLItem].bSelectedForOrder = oOldWL[idxWLCur].WLItems[idxWLItemOld].bSelectedForOrder;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        gWatchlists[gWatchlists.length] = oWL;
                    }
                }
            }
        }

        //add an Account Saved Orders watchlist for each account 
        if (gbShowSavedOrders) {
            if (gAccounts.length > 0) {
                for (let idxAccounts = 0; idxAccounts < gAccounts.length; idxAccounts++) {
                    oAccount = new Account();
                    oAccount = gAccounts[idxAccounts];

                    let oWL = new WLWatchList();
                    oWL.accountId = oAccount.accountId;
                    oWL.accountName = oAccount.accountName;
                    oWL.watchlistId = oAccount.accountId + "AccountSavedOrders";
                    oWL.name = gsAccountSavedOrders;

                    if (bDoingReset) {
                        //check to see if the Account Saved Orders watchlist has been selected
                        for (let idxWLCur = 0; idxWLCur < oOldWL.length; idxWLCur++) {
                            if ((oWL.accountId == oOldWL[idxWLCur].accountId) &&
                                (oWL.name == oOldWL[idxWLCur].name)) {
                                oWL.spanName = oOldWL[idxWLCur].spanName;
                                if (oOldWL[idxWLCur].bSelectedSO) {
                                    oWL.bSelectedSO = true;
                                    oWL.bSelectedSOTemp = true;

                                    // now copy all existing items
                                    if (oOldWL[idxWLCur].WLItems.length > 0) {
                                        for (let idxWLItemOld = 0; idxWLItemOld < oOldWL[idxWLCur].WLItems.length; idxWLItemOld++) {
                                            let oWLItem = new WLItemSavedOrder();
                                            oWLItem.bSelected = oOldWL[idxWLCur].WLItems[idxWLItemOld].bSelected;
                                            oWLItem.bSelectedForOrder = oOldWL[idxWLCur].WLItems[idxWLItemOld].bSelectedForOrder;
                                            oWLItem.bSelectedTemp = oOldWL[idxWLCur].WLItems[idxWLItemOld].bSelectedTemp;
                                            oWLItem.cancelTime = oOldWL[idxWLCur].WLItems[idxWLItemOld].cancelTime;
                                            oWLItem.duration = oOldWL[idxWLCur].WLItems[idxWLItemOld].duration;
                                            oWLItem.instruction = oOldWL[idxWLCur].WLItems[idxWLItemOld].instruction;
                                            oWLItem.orderType = oOldWL[idxWLCur].WLItems[idxWLItemOld].orderType;
                                            oWLItem.price = oOldWL[idxWLCur].WLItems[idxWLItemOld].price;
                                            oWLItem.quantity = oOldWL[idxWLCur].WLItems[idxWLItemOld].quantity;
                                            oWLItem.savedOrderId = oOldWL[idxWLCur].WLItems[idxWLItemOld].savedOrderId;
                                            oWLItem.savedTime = oOldWL[idxWLCur].WLItems[idxWLItemOld].savedTime;
                                            oWLItem.session = oOldWL[idxWLCur].WLItems[idxWLItemOld].session;
                                            oWLItem.stopPriceLinkType = oOldWL[idxWLCur].WLItems[idxWLItemOld].stopPriceLinkType;
                                            oWLItem.stopPriceOffset = oOldWL[idxWLCur].WLItems[idxWLItemOld].stopPriceOffset;
                                            oWLItem.symbol = oOldWL[idxWLCur].WLItems[idxWLItemOld].symbol;
                                            oWL.WLItems[oWL.WLItems.length] = oWLItem;
                                       }
                                    }
                                }
                                break;
                            }
                        }
                    }


                    gWatchlists[gWatchlists.length] = oWL;
                }
            }
        }

        gWatchlists.sort(sortByWLAccountandWLName);
    }
}

function GetWatchlistSO() {
    let dt = new Date();
    let sDate = FormatDateWithTime(dt, true, false);
    let sActionSpacesP = "";
    let sActionSpacesT = "";
    let sQuantitySpacesP = "";
    let sQuantitySpacesT = "&nbsp;&nbsp;&nbsp;";
    let sSymbolSpacesP = "&nbsp;&nbsp;&nbsp;";
    let sSymbolSpacesT = "";
    let sOrderTypeSpacesP = "&nbsp;&nbsp;&nbsp;";
    let sOrderTypeSpacesT = "";
    let sPriceSpacesP = "";
    let sPriceSpacesT = "";
    let sActivitationSpacesP = "";
    let sActivitationSpacesT = "&nbsp;&nbsp;&nbsp;";
    let sDurationSpacesP = "";
    let sDurationSpacesT = "";
    let sCreatedSpacesP = "";
    let sCreatedSpacesT = "";
    let sBidSpacesP = "";
    let sBidSpacesT = "&nbsp;&nbsp;&nbsp;";
    let sAskSpacesP = "";
    let sAskSpacesT = "&nbsp;&nbsp;&nbsp;";

    if (gWatchlists.length > 0) {
        for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
            if (gWatchlists[idxWL].bSelectedSO) {
                let sThisDiv = "";
                let sThisTable = "";
                let sLastWLName = "";
                let sLastWLAccountName = "";
                let sLastWLAccountId = "";
                let sThisId = "";
                let sTableRowVerticalAlignment = "middle";
                let sTmp = "";
                let bEverythingIsChecked = true;


                //get list of currently selected saved orders
                let oCurrentSOIDs = [];
                if (gWatchlists[idxWL].WLItems.length > 0) {
                    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                        let oWLSOItem = new WLItemSavedOrder();
                        oWLSOItem = gWatchlists[idxWL].WLItems[idxWLItem];
                        if (oWLSOItem.bSelectedForOrder) {
                            oCurrentSOIDs[oWLSOItem.savedOrderId] = oWLSOItem.bSelectedForOrder;
                        }
                    }
                }

                let iReturn = GetTDDataHTTP("https://api.tdameritrade.com/v1/accounts/" + gWatchlists[idxWL].accountId + "/savedorders", 5);
                if (iReturn == 0) {
                    gWatchlists[idxWL].WLItems.length = 0;
                    if (!isUndefined(oCMSavedOrders.length)) {
                        for (let idxSO = oCMSavedOrders.length - 1; idxSO > -1; idxSO--) {
                            let bNeedToAdd = false;
                            if (!isUndefined(oCMSavedOrders[idxSO].savedOrderId)) {
                                let oWLSOItem = new WLItemSavedOrder();
                                if (!isUndefined(oCMSavedOrders[idxSO].cancelTime)) {
                                    oWLSOItem.cancelTime = oCMSavedOrders[idxSO].cancelTime;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].duration)) {
                                    oWLSOItem.duration = oCMSavedOrders[idxSO].duration;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].orderLegCollection[0].instruction)) {
                                    oWLSOItem.instruction = oCMSavedOrders[idxSO].orderLegCollection[0].instruction;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].orderType)) {
                                    oWLSOItem.orderType = oCMSavedOrders[idxSO].orderType;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].price)) {
                                    oWLSOItem.price = oCMSavedOrders[idxSO].price;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].orderLegCollection[0].quantity)) {
                                    oWLSOItem.quantity = oCMSavedOrders[idxSO].orderLegCollection[0].quantity;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].savedOrderId)) {
                                    oWLSOItem.savedOrderId = oCMSavedOrders[idxSO].savedOrderId;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].savedTime)) {
                                    oWLSOItem.savedTime = oCMSavedOrders[idxSO].savedTime;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].session)) {
                                    oWLSOItem.session = oCMSavedOrders[idxSO].session;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].stopPriceOffset)) {
                                    oWLSOItem.stopPriceOffset = oCMSavedOrders[idxSO].stopPriceOffset;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].stopPriceLinkType)) {
                                    oWLSOItem.stopPriceLinkType = oCMSavedOrders[idxSO].stopPriceLinkType;
                                }
                                if (!isUndefined(oCMSavedOrders[idxSO].orderLegCollection[0].instrument.symbol)) {
                                    oWLSOItem.symbol = oCMSavedOrders[idxSO].orderLegCollection[0].instrument.symbol;
                                }
                                if (!isUndefined(oCurrentSOIDs[oCMSavedOrders[idxSO].savedOrderId])) {
                                    //already displayed so reset the selectfororder flag
                                    oWLSOItem.bSelectedForOrder = oCurrentSOIDs[oCMSavedOrders[idxSO].savedOrderId];
                                }
                                gWatchlists[idxWL].WLItems[gWatchlists[idxWL].WLItems.length] = oWLSOItem;
                            }
                        }
                    }
                    //now display the watchlist

                    sThisDiv = "";
                    sLastWLName = gWatchlists[idxWL].name;
                    sLastWLAccountName = gWatchlists[idxWL].accountName;
                    sLastWLAccountId = gWatchlists[idxWL].accountId;
                    sThisId = gWatchlists[idxWL].watchlistId + sLastWLAccountId;

                    if (gbUsingCell) {
                        sThisDiv = sThisDiv + "<div style=\"width:800px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                        sThisDiv = sThisDiv + "<table style=\"width:800px; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                        sThisDiv = sThisDiv + "<tr>";

                        sThisDiv = sThisDiv + "<th style=\"height:30px; text-align:left; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                            "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLPlaceSavedOrders(" + idxWL.toString() + ")\" value=\"Place\" ></th>";

                        sThisDiv = sThisDiv + "<th style=\"height:30px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:0px;border-color:White\">" +
                            "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                            "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" +
                            "<span style=\"vertical-align: middle;\" id=\"spanSODate" + sThisId + "\" name=\"spanSODate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th > ";

                        sThisDiv = sThisDiv + "<th style=\"height:30px; text-align:right;vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                            "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoSODeleteOrders(" + idxWL.toString() + ")\" value=\"Delete\" ></th>";

                        sThisDiv = sThisDiv + "<th style=\"height:30px;text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWL.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                        sThisDiv = sThisDiv + "</tr>";

                        sThisDiv = sThisDiv + "<tr>";
                        sThisDiv = sThisDiv + "<td colspan=\"4\" style=\"vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";
                    } else { //not using cell

                        sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                        sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                        sThisDiv = sThisDiv + "<tr>";

                        sThisDiv = sThisDiv + "<th style=\"width:" + (giWLColOpenLabelWidth + giWLColOpenEntryWidth + giWLColAcquiredDateEntryWidth).toString() + "px; text-align:left; vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                            "&nbsp;<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoWLPlaceSavedOrders(" + idxWL.toString() + ")\" value=\"Place\" ></th>";

                        sThisDiv = sThisDiv + "<th style=\"width:" + giWLColTitleWidth.toString() + "px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:0px; border-style:solid;border-spacing:0px;border-color:White\">" +
                            "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                            "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" +
                            "<span style=\"vertical-align: middle;\" id=\"spanSODate" + sThisId + "\" name=\"spanSODate" + sThisId + "\"><b>&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th >";

                        sThisDiv = sThisDiv + "<th style=\"width:" + (giWLColCloseLabelWidth + giWLColCloseEntryWidth).toString() + "px;text-align:right;vertical-align:middle;border-top-width:1px;border-bottom-width:1px;border-left-width:0px;border-right-width:0px;border-style:solid;border-spacing:0px;border-color:White\">" +
                            "<input type=\"button\" style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\"  onclick=\"DoSODeleteOrders(" + idxWL.toString() + ")\" value=\"Delete\" ></th>";

                        sThisDiv = sThisDiv + "<th style=\"width:" + giWLCol2Width.toString() + "px; text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWL.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                        sThisDiv = sThisDiv + "</tr>";

                        sThisDiv = sThisDiv + "<tr>";
                        sThisDiv = sThisDiv + "<td colspan=\"4\" style=\"vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";

                    }
                    sThisDiv = sThisDiv + "<div id=\"divtable" + sThisId + "\" style =\"border-spacing:0px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                    sThisTable = "";
                    sThisTable = sThisTable + "<table style=\"border-collapse:collapse; border: 0px solid black;background-color:" + gsWLTableBackgroundColor + "; width:100%;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                    sThisTable = sThisTable + "<tr>";

                    if (gWatchlists[idxWL].WLItems.length == 0) {
                        //no saved orders
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\">No saved orders for this account.</td>";
                        sThisTable = sThisTable + "</tr>";
                    } else {
                        sThisTable = sThisTable + "<td colspan=\"10\" style=\"text-align=left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px; \">";
                        sThisTable = sThisTable + "Total saved orders " + gWatchlists[idxWL].WLItems.length.toString() + " (max 200)";
                        sThisTable = sThisTable + "</td>";
                        sThisTable = sThisTable + "</tr>";
                        sThisTable = sThisTable + "<tr>";

                        let sThischkItemId = "chkWLItem" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + "000";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\">" +
                            "<input xxthisWillBeReplacedxx style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \" type=\"checkbox\" id=\"" + sThischkItemId + "\" name=\"" + sThischkItemId + "\" value=\"\" onclick=\"wlMarkSelectedItem(" + idxWL.toString() + ", " + "-1" + ")\">" +
                            "<span style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \">" +
                            "<b><I>" + sActionSpacesP + "Action" + sActionSpacesT + "</I></b></span></td> ";



                        sThisTable = sThisTable + "<td style=\"text-align:right;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sQuantitySpacesP + "Quantity" + sQuantitySpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sSymbolSpacesP + "Symbol" + sSymbolSpacesT + "</I></b></td> ";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sOrderTypeSpacesP + "Order&nbsp;Type" + sOrderTypeSpacesT + "</I></b></td> ";
                        sThisTable = sThisTable + "<td style=\"text-align:right;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sPriceSpacesP + "Price" + sPriceSpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:right;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sActivitationSpacesP + "Activation" + sActivitationSpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sDurationSpacesP + "Time-in-Force" + sDurationSpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sCreatedSpacesP + "Created" + sCreatedSpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:right;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sBidSpacesP + "Bid" + sBidSpacesT + "</I></b></td>";
                        sThisTable = sThisTable + "<td style=\"text-align:right;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sAskSpacesP + "Ask" + sAskSpacesT + "</I></b></td>";

                        sThisTable = sThisTable + "</tr>";

                        let iLineCnt = 0;
                        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {

                            let oWLSOItem = new WLItemSavedOrder();
                            oWLSOItem = gWatchlists[idxWL].WLItems[idxWLItem];
                            iLineCnt++;
                            let sChecked = "";
                            let sThisidxWLItem = "";
                            //let idxThisSymbol = idxWLItem;
                            //let idxThisSymbolidxWLItem = idxWLItem;
                            //let idxThisSymbolselected = sSymbolsSelectedForOrderThisWL.substring(idxThisSymbolidxWLItem + idxThisSymbol + 2, sSymbolsSelectedForOrderThisWL.length - 1).indexOf(",");
                            //sThisidxWLItem = sSymbolsSelectedForOrderThisWL.substr(idxThisSymbol + idxThisSymbolidxWLItem + 2, idxThisSymbolselected);

                            if (oWLSOItem.bSelectedForOrder) {
                                sChecked = "checked";
                            } else {
                                bEverythingIsChecked = false;
                            }
                            let sThisTRId = "TR" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + FormatIntegerNumber(idxWLItem, 3, "0");
                            if (sChecked == "checked") {
                                sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableSelectedRowBackgroundColor + ";\">";
                            } else {
                                if ((iLineCnt % 2) == 0) {
                                    sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableEvenRowBackgroundColor + ";\">";
                                } else {
                                    sThisTable = sThisTable + "<tr id=\"" + sThisTRId + "\"  name=\"" + sThisTRId + "\" style=\"background-color:" + gsWLTableOddRowBackgroundColor + ";\">";
                                }
                            }

                            //check box and Action - instruction
                            let sThischkItemId = "chkWLItem" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + FormatIntegerNumber(idxWLItem, 3, "0");
                            sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" +
                                "<input style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";\" id=\"" + sThischkItemId + "\" name=\"" + sThischkItemId + "\" type=\"checkbox\" " + sChecked + " value=\"\" onclick=\"wlMarkSelectedItem(" + idxWL.toString() + ", " + idxWLItem.toString() + ")\">" +
                                "<span style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + "; \">" +
                                sActionSpacesP + oWLSOItem.instruction.toProperCase(true) + sActionSpacesT + "</span></td>";

                            //Qty - quantity
                            sTmp = FormatDecimalNumber(oWLSOItem.quantity, 5, 0, "");
                            let dQty = parseFloat(sTmp);
                            if (dQty == 0.0) {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                            } else {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sQuantitySpacesP + sTmp + sQuantitySpacesT + "</td>";
                            }

                            //Symbol - symbol
                            sTmp = oWLSOItem.symbol;
                            sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sSymbolSpacesP + sTmp + sSymbolSpacesT + "</td>";

                            //Order Type - orderType aqnd maybe stopPriceLinkType
                            sTmp = oWLSOItem.orderType;
                            if (sTmp == "TRAILING_STOP") {
                                sTmp = "Trailing&nbsp;Stop&nbsp;" + oWLSOItem.stopPriceLinkType.toProperCase(true);
                            } else {
                                sTmp = sTmp.toProperCase(true);
                            }
                            sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sOrderTypeSpacesP + sTmp + sOrderTypeSpacesT + "</td>";

                            //Price - price
                            sTmp = FormatDecimalNumber(oWLSOItem.price, 5, 2, "");
                            let dPrice = parseFloat(sTmp);
                            if (dPrice == 0.0) {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                            } else {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sPriceSpacesP + sTmp + sPriceSpacesT + "</td>";
                            }

                            //Activation - stopPriceOffset
                            sTmp = FormatDecimalNumber(oWLSOItem.stopPriceOffset, 5, 0, "");
                            let stopPriceOffset = parseFloat(sTmp);
                            if (stopPriceOffset == 0.0) {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                            } else {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sActivitationSpacesP + sTmp + "%" + sActivitationSpacesT + "</td>";
                            }

                            //Time-in-Force - duration
                            sTmp = oWLSOItem.duration;
                            if (sTmp == "GOOD_TILL_CANCEL") {
                                sTmp = "GTC";
                                if (dPrice == 0.0) {
                                    sTmp = "GTC";
                                } else {
                                    sTmp = "GTC&nbsp;+&nbsp;ext.";
                                }
                            } else {
                                sTmp = sTmp.toProperCase(true);
                            }
                            sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sDurationSpacesP + sTmp + sDurationSpacesT + "</td>";

                            //Created - 
                            let d = new Date(oWLSOItem.savedTime.split("+")[0] + "+00:00");
                            sTmp = FormatTDTradeDate(d);
                            sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sCreatedSpacesP + sTmp + sCreatedSpacesT + "</td>";

                            //Bid
                            let dBidPrice = 0.0;
                            if (!isUndefined(oMDQ[oWLSOItem.symbol].bidPrice)) {
                                dBidPrice = oMDQ[oWLSOItem.symbol].bidPrice;
                            }
                            sTmp = FormatDecimalNumber(dBidPrice, 5, 2, "");
                            if (dBidPrice == 0.0) {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                            } else {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sBidSpacesP + sTmp + sBidSpacesT + "</td>";
                            }

                            //Ask
                            let dAskPrice = 0.0;
                            if (!isUndefined(oMDQ[oWLSOItem.symbol].askPrice)) {
                                dAskPrice = oMDQ[oWLSOItem.symbol].askPrice;
                            }
                            sTmp = FormatDecimalNumber(dAskPrice, 5, 2, "");
                            if (dAskPrice == 0.0) {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                            } else {
                                sThisTable = sThisTable + "<td style=\"text-align:right; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sAskSpacesP + sTmp + sAskSpacesT + "</td>";
                            }

                            sThisTable = sThisTable + "</tr>";

                        }

                    }




                } else {
                    //an error occurred, so don't update anything
                    return;
                }


                if (sThisTable != "") {
                    sThisTable = sThisTable + "</table>";
                    if (bEverythingIsChecked) {
                        sThisTable = sThisTable.replace("xxthisWillBeReplacedxx", "checked");
                    }

                    sThisDiv = sThisDiv + sThisTable + "</div ></td ></tr ></table ></div > ";
                }
                if (gWatchlists[idxWL].spanName == "") {
                    gWatchlists[idxWL].spanName = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;
                    sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWL].spanName);
                    wlAddDiv(gWatchlists[idxWL].spanName, sThisDiv);
                } else {
                    if (document.getElementById(gWatchlists[idxWL].spanName).innerHTML == "") {
                        sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWL].spanName);
                        document.getElementById(gWatchlists[idxWL].spanName).innerHTML = sThisDiv;
                    } else {
                        document.getElementById("divtable" + sThisId).innerHTML = sThisTable;
                        if (!isUndefined(document.getElementById("spanSODate" + sThisId))) {
                            document.getElementById("spanSODate" + sThisId).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + sDate;
                        }
                    }
                }
            }

        }
    }
}

function GetWatchlistSummary() {

    let oWLItemDetail = new WLItemDetail();
    let dt = new Date();
    let sDate = FormatDateWithTime(dt, true, false);
    let bProcessThisWL = false;
    let bDontHighlightChanges = true;

    if (gWatchlists.length > 0) {
        for (let idxWLSummaryMain = 0; idxWLSummaryMain < gWatchlists.length; idxWLSummaryMain++) {
            if (gWatchlists[idxWLSummaryMain].bSelectedWLSummary) {
                let bProcessThisWL = false;
                if (gWatchlists[idxWLSummaryMain].spanName == "") {
                    bProcessThisWL = true;
                } else if (document.getElementById(gWatchlists[idxWLSummaryMain].spanName).innerHTML == "") {
                    bProcessThisWL = true;
                }
                if (bProcessThisWL) {
                    let sSymbols = "";
                    let sSep = "";
                    for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                        if ((gWatchlists[idxWL].name != gsAccountSavedOrders) &&
                            (gWatchlists[idxWL].name != gsAccountWLSummary) &&
                            (gWatchlists[idxWL].name.toUpperCase().indexOf("DIVIDEND") == -1) &&
                            (gWatchlists[idxWL].accountId != gWatchlists[idxWL].watchlistId) &&
                            (gWatchlists[idxWL].accountId == gWatchlists[idxWLSummaryMain].accountId)) {
                            for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                                if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                                    sSymbols = sSymbols + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                                    sSep = ",";
                                }
                            }
                            sSymbols = GetUniqueListOfSymbols(sSymbols);
                        }
                    }

                    if (sSymbols.length > 0) {
                        let aSymbolsToUse = sSymbols.split(",");
                        gWLDisplayed.length = 0;
                        for (let idxSymbol = 0; idxSymbol < aSymbolsToUse.length; idxSymbol++) {
                            let sSymbol = aSymbolsToUse[idxSymbol];
                            if (!isUndefined(oMDQ[sSymbol])) {
                                let oWLDisplayed = new WLDisplayed();
                                oWLDisplayed.symbol = sSymbol;
                                oWLDisplayed.assetType = oMDQ[sSymbol].assetType;

                                //get account position info if it exists
                                let oPositions = new Array();
                                for (let idxAccount = 0; idxAccount < gAccounts.length; idxAccount++) {
                                    if (gAccounts[idxAccount].positions.length > 0) {
                                        if (gAccounts[idxAccount].accountId == gWatchlists[idxWLSummaryMain].accountId) {
                                            for (let idxPositions = 0; idxPositions < gAccounts[idxAccount].positions.length; idxPositions++) {
                                                if (gAccounts[idxAccount].positions[idxPositions].symbol == sSymbol) {
                                                    let oPosition = new Position();
                                                    oPosition = gAccounts[idxAccount].positions[idxPositions];
                                                    oPosition.accountId = gAccounts[idxAccount].accountId;
                                                    oPosition.accountName = gAccounts[idxAccount].accountName;
                                                    oPositions[oPositions.length] = oPosition;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }

                                oWLItemDetail = new WLItemDetail();
                                if (oWLDisplayed.assetType == "OPTION") {
                                    if (!isUndefined(oMDQ[sSymbol].mark)) {
                                        oWLItemDetail.lastPrice = oMDQ[sSymbol].mark;
                                    }
                                } else if (oWLDisplayed.assetType == "INDEX") {
                                    if (!isUndefined(oMDQ[sSymbol].lastPrice)) {
                                        oWLItemDetail.lastPrice = oMDQ[sSymbol].lastPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].highPrice)) {
                                        oWLItemDetail.highPrice = oMDQ[sSymbol].highPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].lowPrice)) {
                                        oWLItemDetail.lowPrice = oMDQ[sSymbol].lowPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].netChange)) {
                                        oWLItemDetail.netChange = oMDQ[sSymbol].netChange;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].netPercentChangeInDouble)) {
                                        oWLItemDetail.netPercentChangeInDouble = oMDQ[sSymbol].netPercentChangeInDouble;
                                    }
                                } else {
                                    if (!isUndefined(oMDQ[sSymbol].lastPrice)) {
                                        oWLItemDetail.lastPrice = oMDQ[sSymbol].lastPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].askPrice)) {
                                        oWLItemDetail.askPrice = oMDQ[sSymbol].askPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].bidPrice)) {
                                        oWLItemDetail.bidPrice = oMDQ[sSymbol].bidPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].highPrice)) {
                                        oWLItemDetail.highPrice = oMDQ[sSymbol].highPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].lowPrice)) {
                                        oWLItemDetail.lowPrice = oMDQ[sSymbol].lowPrice;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].netChange)) {
                                        oWLItemDetail.netChange = oMDQ[sSymbol].netChange;
                                    }
                                    if (!isUndefined(oMDQ[sSymbol].netPercentChangeInDouble)) {
                                        oWLItemDetail.netPercentChangeInDouble = oMDQ[sSymbol].netPercentChangeInDouble;
                                    }

                                    if (!isUndefined(oMDQ[sSymbol].regularMarketLastPrice)) {
                                        oWLItemDetail.regularMarketLastPrice = oMDQ[sSymbol].regularMarketLastPrice;
                                    }

                                    if (!isUndefined(oMDQ[sSymbol].regularMarketNetChange)) {
                                        oWLItemDetail.regularMarketNetChange = oMDQ[sSymbol].regularMarketNetChange;
                                    }

                                    if (!isUndefined(oMDQ[sSymbol].regularMarketPercentChangeInDouble)) {
                                        oWLItemDetail.regularMarketPercentChangeInDouble = oMDQ[sSymbol].regularMarketPercentChangeInDouble;
                                    }
                                }
                                if (oPositions.length > 0) {
                                    for (let idxPositions = 0; idxPositions < oPositions.length; idxPositions++) {
                                        let oPosition = new Position();
                                        oPosition = oPositions[idxPositions];

                                        oWLItemDetail.shares = 0;
                                        oWLItemDetail.dayGain = 0.0;
                                        oWLItemDetail.costPerShare = 0.0;
                                        oWLItemDetail.gain = 0.0;
                                        oWLItemDetail.gainPercent = 0.0;
                                        oWLItemDetail.accountId = "";
                                        oWLItemDetail.marketValue = oPosition.marketValue;

                                        oWLItemDetail.accountId = oPosition.accountId;
                                        oWLItemDetail.accountName = oPosition.accountName;
                                        oWLItemDetail.shares = oPosition.longQuantity;
                                        oWLItemDetail.dayGain = oPosition.currentDayProfitLoss;
                                        oWLItemDetail.costPerShare = oPosition.averagePrice;
                                        if (oWLItemDetail.shares > 0) {
                                            oWLItemDetail.gain = oWLItemDetail.shares * (oWLItemDetail.regularMarketLastPrice - oWLItemDetail.costPerShare);
                                            if (oWLItemDetail.costPerShare != 0.0) {
                                                oWLItemDetail.gainPercent = ((oWLItemDetail.regularMarketLastPrice - oWLItemDetail.costPerShare) / oWLItemDetail.costPerShare) * 100.0;
                                            }
                                        }
                                        oWLDisplayed.WLItemDetails[oWLDisplayed.WLItemDetails.length] = oWLItemDetail;
                                    }
                                } else {
                                    oWLDisplayed.WLItemDetails[oWLDisplayed.WLItemDetails.length] = oWLItemDetail;
                                }
                                gWLDisplayed[gWLDisplayed.length] = oWLDisplayed;
                            } else {
                                //it should never get here - it means that the current price for the symbol could not be found - should not continue because the results will be incorrect
                                //debugger
                                return; //give up and wait for all symbols to be found
                            }
                        }

                        //now show the results
                        let sLastWLName = "";
                        let sLastWLId = "";
                        let sLastWLAccountName = "";
                        let sLastWLAccountId = "";
                        let sThisId = "";
                        let sTmp = "";

                        if (gWLDisplayed.length > 0) {

                            gWLDisplayed.sort(sortBySymbol);

                            gWLSummaryDisplayed.length = 0;

                            for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                                if ((gWatchlists[idxWL].name != gsAccountSavedOrders) &&
                                    (gWatchlists[idxWL].name != gsAccountWLSummary) &&
                                    (gWatchlists[idxWL].name.toUpperCase().indexOf("DIVIDEND") == -1) &&
                                    (gWatchlists[idxWL].accountId != gWatchlists[idxWL].watchlistId) &&
                                    (gWatchlists[idxWL].accountId == gWatchlists[idxWLSummaryMain].accountId)) {

                                    let iTotalSymbolsUp = 0;
                                    let iTotalSymbolsDown = 0;
                                    let iTotalSymbolsUpDay = 0;
                                    let iTotalSymbolsDownDay = 0;
                                    let sSymbolsThisWL = "";
                                    let sSep = "";

                                    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                                        if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                                            sSymbolsThisWL = sSymbolsThisWL + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                                            sSep = ",";
                                        }
                                    }

                                    sSymbolsThisWL = "," + GetUniqueListOfSymbols(sSymbolsThisWL) + ",";

                                    sLastWLName = gWatchlists[idxWL].name;
                                    sLastWLAccountName = gWatchlists[idxWL].accountName;
                                    sLastWLAccountId = gWatchlists[idxWL].accountId;
                                    sLastWLId = gWatchlists[idxWL].watchlistId;
                                    sThisId = gWatchlists[idxWL].watchlistId + sLastWLAccountId;

                                    let dTotalCost = 0.0;
                                    let iLineCnt = 0;
                                    let dTotalHoldingsGain = 0.0;
                                    let dTotalGain = 0.0;
                                    let dTotalDayGain = 0.0;
                                    for (let idxDisplayed = 0; idxDisplayed < gWLDisplayed.length; idxDisplayed++) {
                                        let oWLDisplayed = new WLDisplayed();
                                        oWLDisplayed = gWLDisplayed[idxDisplayed];
                                        let sSymbol = oWLDisplayed.symbol;
                                        let oWLItemDetail = new WLItemDetail();
                                        let dCost = 0.0;
                                        let dQty = 0.0;
                                        if (sSymbolsThisWL.indexOf("," + sSymbol + ",") != -1) {
                                            for (let idxItemDetail = 0; idxItemDetail < oWLDisplayed.WLItemDetails.length; idxItemDetail++) {
                                                oWLItemDetail = oWLDisplayed.WLItemDetails[idxItemDetail];
                                                if ((gWatchlists[idxWL].accountId == oWLItemDetail.accountId) ||
                                                    (oWLItemDetail.accountId == "")) {
                                                    iLineCnt++;

                                                    //Qty
                                                    sTmp = FormatDecimalNumber(oWLItemDetail.shares, 5, 0, "");
                                                    dQty = parseFloat(sTmp);

                                                    sTmp = FormatDecimalNumber(oWLItemDetail.dayGain, 5, 2, "");
                                                    dTotalDayGain = dTotalDayGain + parseFloat(sTmp);
                                                    if (parseFloat(sTmp) < 0.0) {
                                                        if (oWLItemDetail.shares > 0.0) {
                                                            iTotalSymbolsDownDay++;
                                                        }
                                                    } else if (parseFloat(sTmp) > 0.0) {
                                                        if (oWLItemDetail.shares > 0.0) {
                                                            iTotalSymbolsUpDay++;
                                                        }
                                                    }

                                                    sTmp = FormatDecimalNumber(oWLItemDetail.gain, 5, 2, "");
                                                    if (parseFloat(sTmp) < 0.0) {
                                                        if (oWLItemDetail.shares > 0.0) {
                                                            iTotalSymbolsDown++;
                                                        }
                                                    } else if (parseFloat(sTmp) > 0.0) {
                                                        if (oWLItemDetail.shares > 0.0) {
                                                            iTotalSymbolsUp++;
                                                        }
                                                    }
                                                    dTotalGain = dTotalGain + parseFloat(sTmp);
                                                    dTotalHoldingsGain = dTotalHoldingsGain + parseFloat(sTmp);

                                                    //Cost
                                                    sTmp = FormatDecimalNumber(oWLItemDetail.costPerShare, 5, 2, "");
                                                    dCost = parseFloat(sTmp);
                                                    dTotalCost = dTotalCost + (dCost * dQty);

                                                    //Old G/L
                                                    let dTmpOrig = 0.0;
                                                    for (let idxTmp = 0; idxTmp < gWatchlists[idxWL].WLItems.length; idxTmp++) {
                                                        if (gWatchlists[idxWL].WLItems[idxTmp].symbol == sSymbol) {
                                                            dTmpOrig = gWatchlists[idxWL].WLItems[idxTmp].priceInfo.averagePrice;
                                                            break;
                                                        }
                                                    }
                                                    sTmp = FormatDecimalNumber(dTmpOrig, 5, 2, "");
                                                    let dTmp = parseFloat(sTmp);
                                                    dTotalGain = dTotalGain + dTmp;

                                                }
                                            }
                                        }

                                    }
                                    if (iLineCnt != 0) {

                                        if ((isUndefined(goWLSummaryDisplayed)) || (isUndefined(goWLSummaryDisplayed[sThisId]))) {
                                            let oT = {
                                                "watchlistName": sLastWLName,
                                                "dayUp": iTotalSymbolsUpDay,
                                                "dayDown": iTotalSymbolsDownDay,
                                                "dayCost": dTotalCost,
                                                "dayGain": dTotalDayGain,
                                                "dayGainPercent": (dTotalCost == 0 ? 0 : (dTotalDayGain / dTotalCost) * 100),
                                                "holdingsGain": dTotalHoldingsGain,
                                                "holdingsGainPercent": (dTotalCost == 0 ? 0 : (dTotalHoldingsGain / dTotalCost) * 100),
                                                "holdingsUp": iTotalSymbolsUp,
                                                "holdingsDown": iTotalSymbolsDown,
                                                "portfolioGain": dTotalGain
                                            }
                                            goWLSummaryDisplayed[sThisId] = oT;
                                        }
                                        let oSummaryDisplay = new WLSummaryDisplayed();
                                        oSummaryDisplay.accountId = sLastWLAccountId;
                                        oSummaryDisplay.accountName = sLastWLAccountName;
                                        let idxSummaryDisplayed = -1;
                                        if (gWLSummaryDisplayed.length == 0) {
                                            gWLSummaryDisplayed[gWLSummaryDisplayed.length] = oSummaryDisplay;
                                            idxSummaryDisplayed = 0;
                                        } else {
                                            for (let idx = 0; idx < gWLSummaryDisplayed.length; idx++) {
                                                if (gWLSummaryDisplayed[idx].accountId == oSummaryDisplay.accountId) {
                                                    idxSummaryDisplayed = idx;
                                                    break;
                                                }
                                            }
                                        }
                                        if (idxSummaryDisplayed > -1) {
                                            let oItemDay = new WLSummaryDayItemDetail();
                                            let oItemHolding = new WLSummaryHoldingItemDetail();
                                            let oItemPortfolio = new WLSummaryPortfolioItemDetail();
                                            oItemDay.cost = dTotalCost;
                                            oItemDay.down = iTotalSymbolsDownDay;
                                            oItemDay.gain = dTotalDayGain;
                                            if (dTotalCost == 0) {
                                                oItemDay.gainPercent = 0;
                                            } else {
                                                oItemDay.gainPercent = (dTotalDayGain / dTotalCost) * 100;
                                            }
                                            oItemDay.up = iTotalSymbolsUpDay;
                                            oItemDay.watchlistName = sLastWLName;
                                            oItemDay.watchlistId = sLastWLId;

                                            oItemHolding.gain = dTotalHoldingsGain;
                                            if (dTotalCost == 0) {
                                                oItemHolding.gainPercent = 0;
                                            } else {
                                                oItemHolding.gainPercent = (dTotalHoldingsGain / dTotalCost) * 100;
                                            }
                                            oItemHolding.up = iTotalSymbolsUp;
                                            oItemHolding.down = iTotalSymbolsDown;
                                            oItemHolding.watchlistName = sLastWLName;
                                            oItemHolding.watchlistId = sLastWLId;

                                            oItemPortfolio.gain = dTotalGain;
                                            oItemPortfolio.watchlistName = sLastWLName;
                                            oItemPortfolio.watchlistId = sLastWLId;

                                            gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryDayItemDetails[gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryDayItemDetails.length] = oItemDay;
                                            gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryHoldingItemDetails[gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryHoldingItemDetails.length] = oItemHolding;
                                            gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryPortfolioItemDetails[gWLSummaryDisplayed[idxSummaryDisplayed].WLSummaryPortfolioItemDetails.length] = oItemPortfolio;
                                        } else {
                                            //should never get here
                                        }
                                    }

                                }
                            }
                            //-------------------------------------------------------------------------------
                            //have all data so show results
                            let sHeadingTextAlign = "center";
                            let sBodyTextAlign = "center";
                            let sTableRowVerticalAlignment = "middle";
                            let iLineCnt = 0;
                            let sThisDiv = "";
                            let sThisTable = "";
                            if (gWLSummaryDisplayed.length > 0) {
                                for (let idxWLSummary = 0; idxWLSummary < gWLSummaryDisplayed.length; idxWLSummary++) {
                                    gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails.sort(sortByDayGainPercent);
                                    gWLSummaryDisplayed[idxWLSummary].WLSummaryHoldingItemDetails.sort(sortByHoldingGainPercent);
                                    gWLSummaryDisplayed[idxWLSummary].WLSummaryPortfolioItemDetails.sort(sortByPortfolioGain);

                                    //get WL ranking
                                    //debugger
                                    let aRank = new Array();
                                    for (let idxDisplayed = 0; idxDisplayed < gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails.length; idxDisplayed++) {
                                        let oWLSummaryDayItem = new WLSummaryDayItemDetail();
                                        oWLSummaryDayItem = gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails[idxDisplayed];
                                        if ((oWLSummaryDayItem.cost > 0) && (oWLSummaryDayItem.watchlistName.toUpperCase().indexOf("MY COLLECTION") == -1)) {
                                            //let iRank = idxDisplayed + 1;
                                            let iRank = 0;
                                            for (let idxRank = 0; idxRank < gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails.length; idxRank++) {
                                                if (oWLSummaryDayItem.watchlistId == gWLSummaryDisplayed[idxWLSummary].WLSummaryHoldingItemDetails[idxRank].watchlistId) {
                                                    iRank = iRank + idxRank + 1;
                                                }
                                                if (oWLSummaryDayItem.watchlistId == gWLSummaryDisplayed[idxWLSummary].WLSummaryPortfolioItemDetails[idxRank].watchlistId) {
                                                    iRank = iRank + idxRank + 1;
                                                }
                                            }
                                            let oRank = new WLSummaryRank();
                                            oRank.rank = iRank;
                                            oRank.watchlistId = oWLSummaryDayItem.watchlistId;
                                            oRank.watchlistName = oWLSummaryDayItem.watchlistName;
                                            aRank[aRank.length] = oRank;
                                        }
                                    }
                                    aRank.sort(sortByRank);
                                    let iLastRank = 0;
                                    let iCurrentRank = 0;
                                    for (let idxRank = 0; idxRank < aRank.length; idxRank++) {
                                        if (aRank[idxRank].rank > iLastRank) {
                                            iCurrentRank++;
                                            iLastRank = aRank[idxRank].rank;
                                        }
                                        for (let idxDisplayed = 0; idxDisplayed < gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails.length; idxDisplayed++) {
                                            if (gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails[idxDisplayed].watchlistId == aRank[idxRank].watchlistId) {
                                                gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails[idxDisplayed].rank = iCurrentRank;
                                                gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails[idxDisplayed].rankTotal = iLastRank;
                                                break;
                                            }
                                        }
                                    }

                                    sThisDiv = "";
                                    sLastWLName = gWatchlists[idxWLSummaryMain].name;
                                    sLastWLAccountName = gWatchlists[idxWLSummaryMain].accountName;
                                    sLastWLAccountId = gWatchlists[idxWLSummaryMain].accountId;
                                    sThisId = gWatchlists[idxWLSummaryMain].watchlistId + sLastWLAccountId;

                                    sThisDiv = sThisDiv + "<div style=\"width:" + gsWLWidth + "; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisDiv = sThisDiv + "<table style=\"width:" + gsWLWidth + "; background-color:" + gsWLTableHeadingBackgroundColor + "; border-width:1px; border-style:solid; border-spacing:1px; border-color:White; font-family:Arial, Helvetica, sans-serif; font-size:10pt; \">";
                                    sThisDiv = sThisDiv + "<tr>";

                                    sThisDiv = sThisDiv + "<th style=\"height:25px; width:" + giWLCol1Width.toString() + "px; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:1px; border-right-width:0px; border-style:solid; border-spacing:1px; border-color:White\">" +
                                        "<span style=\"vertical-align: middle;\"><b>" + sLastWLAccountName + "--" + sLastWLName + "&nbsp;&nbsp;</b></span>" +
                                        "<span style=\"vertical-align: middle;\"><img src=\"print-icon25px.png\" onclick=\"printdiv('xxxPrintDivNamexxx')\" /></span>" +
                                        "<span style=\"vertical-align: middle;\" id=\"spanSummaryDate" + sThisId + "\" name=\"spanSummaryDate" + sThisId + "\">&nbsp;&nbsp;&nbsp;&nbsp;" + sDate + "</b></span></th > ";
                                    sThisDiv = sThisDiv + "<th style=\"height:25px; width:" + giWLCol2Width.toString() + "px; text-align:right; vertical-align:middle; border-top-width:1px; border-bottom-width:1px; border-left-width:0px; border-right-width:1px; border-style:solid; border-spacing:1px; border-color: White\" onclick=\"wlDoRemoveDiv(" + idxWLSummaryMain.toString() + ")\">&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;</th>";

                                    sThisDiv = sThisDiv + "</tr>";

                                    sThisDiv = sThisDiv + "<tr>";

                                    sThisDiv = sThisDiv + "<td colspan=\"2\" style=\"vertical-align:top;border-width:1px; border-style:solid;border-spacing:1px;border-color:White\">";


                                    sThisDiv = sThisDiv + "<div id=\"divtable" + sThisId + "\" style =\"border-spacing:0px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";
                                    sThisTable = "";
                                    sThisTable = sThisTable + "<table style=\"border-collapse:collapse; border: 0px solid black;background-color:" + gsWLTableBackgroundColor + "; width:100%;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

                                    sThisTable = sThisTable + "<tr height=\"20\">";
                                    let sEndSpaces = "&nbsp;"
                                    let sNameSpaces = ""
                                    let sColumnSeparator = "border-top-width:0px; border-bottom-width:0px; border-left-width:0px; border-right-width:1.5px; border-style:solid; border-spacing:1px; border-color:black;";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b><I>&nbsp;&nbsp;</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sNameSpaces + "Name" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Day&nbsp;Gain(%)" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Day&nbsp;Gain($)" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b><I>Cost" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sNameSpaces + "Name" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Hold&nbsp;Gain(%)" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b><I>Hold&nbsp;Gain($)" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:left;vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>" + sNameSpaces + "Name" + sEndSpaces + "</I></b></td>";
                                    sThisTable = sThisTable + "<td style=\"text-align:" + sHeadingTextAlign + ";vertical-align:" + sTableRowVerticalAlignment + ";border-width:0px;\"><b><I>Portfolio&nbsp;Gain($)" + sEndSpaces + "</I></b></td>";

                                    sThisTable = sThisTable + "</tr>";

                                    for (let idxDisplayed = 0; idxDisplayed < gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails.length; idxDisplayed++) {
                                        let oWLSummaryDayItem = new WLSummaryDayItemDetail();
                                        let oWLSummaryHoldingItem = new WLSummaryHoldingItemDetail();
                                        let oWLSummaryPortfolioItem = new WLSummaryPortfolioItemDetail();
                                        oWLSummaryDayItem = gWLSummaryDisplayed[idxWLSummary].WLSummaryDayItemDetails[idxDisplayed];
                                        oWLSummaryHoldingItem = gWLSummaryDisplayed[idxWLSummary].WLSummaryHoldingItemDetails[idxDisplayed];
                                        oWLSummaryPortfolioItem = gWLSummaryDisplayed[idxWLSummary].WLSummaryPortfolioItemDetails[idxDisplayed];

                                        let sSummaryOldId = oWLSummaryDayItem.watchlistId + sLastWLAccountId;

                                        iLineCnt++;
                                        if ((iLineCnt % 2) == 0) {
                                            sThisTable = sThisTable + "<tr  height=\"20\" style=\"background-color:" + gsWLTableEvenRowBackgroundColor + ";\">";
                                        } else {
                                            sThisTable = sThisTable + "<tr  height=\"20\" style=\"background-color:" + gsWLTableOddRowBackgroundColor + ";\">";
                                        }

                                        //line number
                                        sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">" + iLineCnt.toString() + "</td>";

                                        //Day WL Name
                                        sTmp = sNameSpaces + oWLSummaryDayItem.watchlistName;
                                        sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">&nbsp;(</span>";
                                        sTmp = sTmp + "<span style=\"color:green;vertical-align:" + sTableRowVerticalAlignment + ";\">" + oWLSummaryDayItem.up.toString() + "</span>"
                                        sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">,</span>";
                                        sTmp = sTmp + "<span style=\"color:" + gsNegativeColor + ";vertical-align:" + sTableRowVerticalAlignment + ";\">" + oWLSummaryDayItem.down.toString() + "</span>";
                                        if (oWLSummaryDayItem.rank > 0) {
                                            sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">)&nbsp;" + oWLSummaryDayItem.rank.toString() + "</span>";
//                                            sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">)&nbsp;" + oWLSummaryDayItem.rank.toString() + "&nbsp;" + oWLSummaryDayItem.rankTotal.toString() + "</span>";
                                        } else {
                                            sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">)</span>";
                                        }
                                        sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";

                                        //Day gain percent
                                        sTmp = FormatDecimalNumber(oWLSummaryDayItem.gainPercent, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].dayGainPercent == oWLSummaryDayItem.gainPercent) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                }
                                            }
                                        } else {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                }
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].dayGainPercent = oWLSummaryDayItem.gainPercent;
                                        }

                                        //Day gain
                                        sTmp = FormatDecimalNumber(oWLSummaryDayItem.gain, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].dayGain == oWLSummaryDayItem.gain) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                }
                                            }
                                        } else {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                }
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].dayGain = oWLSummaryDayItem.gain;
                                        }

                                        //Day cost
                                        sTmp = FormatDecimalNumber(oWLSummaryDayItem.cost, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].dayCost == oWLSummaryDayItem.cost) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">&nbsp;</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">" + sTmp + "</td>";
                                            }
                                        } else {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">nbsp;</td>";
                                            } else {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b>" + sTmp + "</b></td>";
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].dayCost = oWLSummaryDayItem.cost;
                                        }

                                        //Holding WL Name
                                        sTmp = sNameSpaces + oWLSummaryHoldingItem.watchlistName;
                                        sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">&nbsp;(</span>";
                                        sTmp = sTmp + "<span style=\"color:green;vertical-align:" + sTableRowVerticalAlignment + ";\">" + oWLSummaryHoldingItem.up.toString() + "</span>"
                                        sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">,</span>";
                                        sTmp = sTmp + "<span style=\"color:" + gsNegativeColor + ";vertical-align:" + sTableRowVerticalAlignment + ";\">" + oWLSummaryHoldingItem.down.toString() + "</span>";
                                        sTmp = sTmp + "<span style=\"vertical-align:" + sTableRowVerticalAlignment + ";\">)</span>";
                                        sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";

                                        //Holding gain percent
                                        sTmp = FormatDecimalNumber(oWLSummaryHoldingItem.gainPercent, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].holdingGainPercent == oWLSummaryHoldingItem.gainPercent) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "%</td>";
                                                }
                                            }
                                        } else {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "%</b></td>";
                                                }
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].holdingGainPercent = oWLSummaryHoldingItem.gainPercent;
                                        }

                                        //Holding gain
                                        sTmp = FormatDecimalNumber(oWLSummaryHoldingItem.gain, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].holdingGain == oWLSummaryHoldingItem.gain) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">&nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">" + sTmp + "</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">" + sTmp + "</td>";
                                                }
                                            }
                                        } else {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\">nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b>" + sTmp + "</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + ";" + sColumnSeparator + "\"><b>" + sTmp + "</b></td>";
                                                }
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].holdingGain = oWLSummaryHoldingItem.gain;
                                        }

                                        //Portfolio WL Name
                                        sTmp = sNameSpaces + oWLSummaryPortfolioItem.watchlistName;
                                        sThisTable = sThisTable + "<td style=\"text-align:left; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";

                                        //Portfolio gain percent
                                        sTmp = FormatDecimalNumber(oWLSummaryPortfolioItem.gain, 5, 2, "");
                                        if ((goWLSummaryDisplayed[sSummaryOldId].portfolioGain == oWLSummaryPortfolioItem.gain) || bDontHighlightChanges) {
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">&nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">" + sTmp + "</td>";
                                                }
                                            }
                                        } else {
                                            //debugger
                                            if (sTmp == "") {
                                                sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \">nbsp;</td>";
                                            } else {
                                                if (parseFloat(sTmp) < 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:" + gsNegativeColor + ";text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else if (parseFloat(sTmp) > 0.0) {
                                                    sThisTable = sThisTable + "<td style=\"color:green;text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                } else {
                                                    sThisTable = sThisTable + "<td style=\"text-align:" + sBodyTextAlign + "; vertical-align:" + sTableRowVerticalAlignment + "; border-width:0px; \"><b>" + sTmp + "</b></td>";
                                                }
                                            }
                                            goWLSummaryDisplayed[sSummaryOldId].portfolioGain = oWLSummaryPortfolioItem.gain;
                                        }

                                        sThisTable = sThisTable + "</tr>";

                                    }
                                    sThisTable = sThisTable + "</table >";
                                    sThisDiv = sThisDiv + sThisTable + "</div ></td ></tr ></table ></div > ";

                                    if (gWatchlists[idxWLSummaryMain].spanName == "") {
                                        gWatchlists[idxWLSummaryMain].spanName = gWatchlists[idxWLSummaryMain].watchlistId + gWatchlists[idxWLSummaryMain].accountId;
                                        sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWLSummaryMain].spanName);
                                        wlAddDiv(gWatchlists[idxWLSummaryMain].spanName, sThisDiv);
                                    } else {
                                        if (document.getElementById(gWatchlists[idxWLSummaryMain].spanName).innerHTML == "") {
                                            sThisDiv = sThisDiv.replace("xxxPrintDivNamexxx", gWatchlists[idxWLSummaryMain].spanName);
                                            document.getElementById(gWatchlists[idxWLSummaryMain].spanName).innerHTML = sThisDiv;
                                        } else {
                                            if (!isUndefined(document.getElementById("spanSummaryDate" + sThisId))) {
                                                document.getElementById("spanSummaryDate" + sThisId).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + sDate;
                                            }
                                            document.getElementById("divtable" + sThisId).innerHTML = sThisTable;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function hideTDAPIError() {
    giAPIErrorTimeoutId = 0;
    document.getElementById("divTDAPIError").innerHTML = "";
    document.getElementById("divTDAPIError").style.display = "none";
    MoveDivs(false);
}

function IsMarketOpen() {
    let iTryCount = 0;
    let idx = 0;
    let bReturn = false;

    let oCM;

    //debugger
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------
        let sServerUrl = "https://api.tdameritrade.com/v1/marketdata/EQUITY/hours"

        let xhttp = null;
        let iInnerTryCount = 0;
        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

            // send the request
            try {
                //debugger
                xhttp.send();
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        //alert("IsMarketOpen xhttp.responseText = " + xhttp.responseText);

                        oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIError(oCM)) {
                            case 0: //no error
                                {
                                    if (oCM["equity"] != null) {
                                        if (oCM["equity"]["EQ"] != null) {
                                            if (oCM.equity.EQ.isOpen) {
                                                bReturn = true;
                                            }
                                        }
                                    }
                                    iTryCount = 2;
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("(IsMarketOpen) An error occurred attempting to refresh the access code. Please reload the app.");
                                        iTryCount = 2;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    oCMLength = 0;
                                    break;
                                }
                            default:
                                {
                                    oCMLength = 0;
                                    break;
                                }
                        }
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("IsMarketOpen Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        //alert ("IsMarketOpen Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                    }
                }
            }
            catch (e1) {
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    alert("IsMarketOpen Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                }
            }
        }
        else {
            break;
        }
    }
    return bReturn;
}

function IsMarketOpenForTrading(bFirstTime) {
    let iTryCount = 0;
    let bReturn = false;
    let bLocalFirstTime = bFirstTime;
    let bSetStatusIndicators = false;

    let oCM;

    if (!bLocalFirstTime) {
        if (gMarketStatus.isInitialized) {
            let dtCurDate = new Date();
            if (FormatDateForTD(dtCurDate) != gMarketStatus.sMarketDate) {
                bLocalFirstTime = true;
            }
        } else {
            bLocalFirstTime = true;
        }
    }

    if ((!bLocalFirstTime) && (gMarketStatus.isInitialized)) {
        if (gMarketStatus.isOpen) {
            let dtCurDate = new Date();
            let dtOpenStart = gMarketStatus.dtPreStart;
            let dtPreEnd = gMarketStatus.dtPreEnd;
            let dtPostStart = gMarketStatus.dtPostStart;
            let dtOpenEnd = gMarketStatus.dtPostEnd;

            if (dtCurDate <= dtPreEnd) {
                gbRegularMarketHours = false;
            } else if (dtCurDate >= dtPostStart) {
                gbRegularMarketHours = false;
            } else {
                gbRegularMarketHours = true;
            }
            if ((dtCurDate >= dtOpenStart) && (dtCurDate <= dtOpenEnd)) {
                bReturn = true;
            }
            if ((dtCurDate >= gMarketStatus.dtPreStart) && (dtCurDate <= gMarketStatus.dtPreEnd)) {
                document.getElementById("spanPreMarket").style.backgroundColor = "green";
                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
            } else if ((dtCurDate >= gMarketStatus.dtRegularStart) && (dtCurDate <= gMarketStatus.dtRegularEnd)) {
                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                document.getElementById("spanRegularMarket").style.backgroundColor = "green";
                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
            } else if ((dtCurDate >= gMarketStatus.dtPostStart) && (dtCurDate <= gMarketStatus.dtPostEnd)) {
                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                document.getElementById("spanPostMarket").style.backgroundColor = "green";
            } else {
                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
            }
        } else {
            document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
            document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
            document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
            bReturn = false;
        }
        bSetStatusIndicators = true;
    } else {
        //debugger
        while (iTryCount < 2) {
            //-------------------------------------------------------------------------------------------------
            let sServerUrl = "https://api.tdameritrade.com/v1/marketdata/EQUITY/hours"

            let xhttp = null;
            let iInnerTryCount = 0;
            xhttp = oHTTP();
            while ((xhttp == null) && (iInnerTryCount < 5)) {
                xhttp = oHTTP();
                iInnerTryCount = iInnerTryCount + 1;
            }
            iInnerTryCount = 0;
            if (CheckHTTPOpenGet(xhttp, sServerUrl, "Error during xhttp.open to " + sServerUrl, false, false, "", "")) {
                // set the request header
                xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

                // send the request
                try {
                    //debugger
                    xhttp.send();
                    if (xhttp.responseText != null) {
                        if (xhttp.responseText != "") {

                            gMarketStatus.isInitialized = true;
                            gMarketStatus.isOpen = false;
                            let dtCurDate = new Date();
                            gMarketStatus.sMarketDate = FormatDateForTD(dtCurDate);

                            oCM = myJSON.parse(xhttp.responseText);
                            switch (checkTDAPIError(oCM)) {
                                case 0: //no error
                                    {
                                        if (oCM["equity"] != null) {
                                            if (oCM["equity"]["EQ"] != null) {
                                                if (oCM.equity.EQ.isOpen) {
                                                    if (!isUndefined(oCM.equity.EQ.sessionHours.preMarket)) {
                                                        if (oCM.equity.EQ.sessionHours.preMarket.length > 0) {
                                                            gMarketStatus.isOpen = true;

                                                            let dtOpenStart = new Date(oCM.equity.EQ.sessionHours.preMarket[0].start);
                                                            let dtPreEnd = new Date(oCM.equity.EQ.sessionHours.preMarket[0].end);
                                                            let dtPostStart = new Date(oCM.equity.EQ.sessionHours.postMarket[0].start);
                                                            let dtOpenEnd = new Date(oCM.equity.EQ.sessionHours.postMarket[0].end);

                                                            gMarketStatus.sMarketDate = FormatDateForTD(dtCurDate);
                                                            gMarketStatus.dtLastIndexCheck = dtCurDate;
                                                            gMarketStatus.dtLastMarketStatusCheck = dtCurDate;
                                                            gMarketStatus.dtLastWLPriceCheck = dtCurDate;
                                                            gMarketStatus.dtPostEnd = new Date(oCM.equity.EQ.sessionHours.postMarket[0].end);
                                                            gMarketStatus.dtPostStart = new Date(oCM.equity.EQ.sessionHours.postMarket[0].start);
                                                            gMarketStatus.dtPreEnd = new Date(oCM.equity.EQ.sessionHours.preMarket[0].end);
                                                            gMarketStatus.dtPreStart = new Date(oCM.equity.EQ.sessionHours.preMarket[0].start);
                                                            gMarketStatus.dtRegularEnd = new Date(oCM.equity.EQ.sessionHours.regularMarket[0].end);
                                                            gMarketStatus.dtRegularStart = new Date(oCM.equity.EQ.sessionHours.regularMarket[0].start);

                                                            if (dtCurDate <= dtPreEnd) {
                                                                gbRegularMarketHours = false;
                                                            } else if (dtCurDate >= dtPostStart) {
                                                                gbRegularMarketHours = false;
                                                            } else {
                                                                gbRegularMarketHours = true;
                                                            }
                                                            if ((dtCurDate >= dtOpenStart) && (dtCurDate <= dtOpenEnd)) {
                                                                bReturn = true;
                                                            }
                                                            if ((dtCurDate >= gMarketStatus.dtPreStart) && (dtCurDate <= gMarketStatus.dtPreEnd)) {
                                                                document.getElementById("spanPreMarket").style.backgroundColor = "green";
                                                                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
                                                            } else if ((dtCurDate >= gMarketStatus.dtRegularStart) && (dtCurDate <= gMarketStatus.dtRegularEnd)) {
                                                                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanRegularMarket").style.backgroundColor = "green";
                                                                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
                                                            } else if ((dtCurDate >= gMarketStatus.dtPostStart) && (dtCurDate <= gMarketStatus.dtPostEnd)) {
                                                                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanPostMarket").style.backgroundColor = "green";
                                                            } else {
                                                                document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
                                                                document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
                                                            }
                                                            bSetStatusIndicators = true;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        iTryCount = 2;
                                        break;
                                    }
                                case 1: //acces code expired
                                    {
                                        xhttp = null;
                                        if (GetAccessCodeUsingRefreshToken()) {
                                            iTryCount++;
                                        } else {
                                            alert("(IsMarketOpenForTrading) An error occurred attempting to refresh the access code. Please reload the app.");
                                            iTryCount = 2;
                                        }
                                        break;
                                    }
                                case 2: //other error
                                    {
                                        oCMLength = 0;
                                        break;
                                    }
                                default:
                                    {
                                        oCMLength = 0;
                                        break;
                                    }
                            }
                        }
                        else {
                            iTryCount++;
                            if (iTryCount < 2) {
                                xhttp = null;
                            }
                            else {
                                //alert ("IsMarketOpenForTrading Error - HTTP response is blank." + " (" + iTryCount.toString() + ")");
                            }
                        }
                    }
                    else {
                        iTryCount++;
                        if (iTryCount < 2) {
                            xhttp = null;
                        }
                        else {
                            //alert ("IsMarketOpenForTrading Error - HTTP response is null." + " (" + iTryCount.toString() + ")");
                        }
                    }
                }
                catch (e1) {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        alert("IsMarketOpenForTrading Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                    }
                }
            }
            else {
                break;
            }
        }
    }

    if (!bSetStatusIndicators) {
        document.getElementById("spanPreMarket").style.backgroundColor = "darkred";
        document.getElementById("spanRegularMarket").style.backgroundColor = "darkred";
        document.getElementById("spanPostMarket").style.backgroundColor = "darkred";
    }
    return bReturn;
}


function isNumberKey(evt) {
    let charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function isUndefined(name) {
    if (typeof name === "undefined") {
        return true;
    }
    return false;
}

// Utility
function jsonToQueryString(json) {
    return Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

function MoveDivs(bMoveDown) {
    let iAmountToChange = 38;
    let iLeftLimit = 770;
    //        debugger
    let oDiv = document.getElementById("tblSymbols");
    let oDivs = new Array();
    if (oDiv.style.visibility.toString().toUpperCase() == "VISIBLE") {
        if (oDiv.offsetLeft < iLeftLimit) {
            oDivs[oDivs.length] = oDiv;
        }
    }
    oDiv = document.getElementById("tblDetail");
    if (oDiv.style.visibility.toString().toUpperCase() == "VISIBLE") {
        if (oDiv.offsetLeft < iLeftLimit) {
            oDivs[oDivs.length] = oDiv;
        }
    }
    for (let idx = 0; idx < gWatchlists.length; idx++) {
        if (gWatchlists[idx].bSelected) {
            if (gWatchlists[idx].spanName != "") {
                oDiv = document.getElementById(gWatchlists[idx].spanName);
                if (oDiv.offsetLeft < iLeftLimit) {
                    oDivs[oDivs.length] = oDiv;
                }
            }
        }
    }

    if (oDivs.length > 0) {
        for (let idxDivs = 0; idxDivs < oDivs.length; idxDivs++) {
            oDiv = oDivs[idxDivs];
            let iTop = parseInt(oDiv.style.top);
            if (bMoveDown) {
                //add to top value
                iTop = iTop + iAmountToChange;
            } else {
                //subtract from top value
                iTop = iTop - iAmountToChange;
            }
            oDiv.style.top = iTop.toString() + "px";
            //                document.getElementById("tblSymbols").style.top = iTop.toString() + "px";
        }
    }
    //div.offsetTop - window.pageYOffset
}

function onClick(ev) {
    if (document.getElementById("spanWLSelectWatchlists").style.visibility.toUpperCase() == "VISIBLE") {
        if (gbShowingSelectWatchlists) {
            wlDoCancelPopup();
        }
    }
}

function onClickInfo(ev) {
    showTDAPIError("Current version is " + gsCurrentVersion);
}

function onKeyDown(ev) {
    let charCode = ev.keyCode;
    // get key
    if ((!ev.ctrlKey) && (ev.shiftKey)) {
        if (charCode == 123) { //check for shift F12 so can display current version
            ev.cancelBubble = true;
            CancelKeyStroke(ev);
            showTDAPIError("Current version is " + gsCurrentVersion);
        } else {
            ev.cancelBubble = false;
        }
    }
    else {
        ev.cancelBubble = false;
    }
}

function onKeyUp(evt) {
    if (gbUseEnterToTogglePriceHistory) {
        let charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode === 13) {
            if (document.getElementById("btnGetStockPriceHistory").disabled == false) {
                // Cancel the default action, if needed
                evt.preventDefault();
                document.getElementById("btnGetStockPriceHistory").click();
            }
        }
    }
}

function OpenSocket() {

    let userPrincipalsResponse = oACCP; /*FILL THIS IN - Get User Principals Response at https://developer.tdameritrade.com/user-principal/apis/get/userprincipals-0 with streamerSubscriptionKeys,streamerConnectionInfo in fields*/

    //Converts ISO-8601 response in snapshot to ms since epoch accepted by Streamer
    let tokenTimeStampAsDateObj = new Date(userPrincipalsResponse.streamerInfo.tokenTimestamp.split("+")[0] + "+00:00");
    let tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();

    let credentials = {
        "userid": userPrincipalsResponse.accounts[0].accountId,
        "token": userPrincipalsResponse.streamerInfo.token,
        "company": userPrincipalsResponse.accounts[0].company,
        "segment": userPrincipalsResponse.accounts[0].segment,
        "cddomain": userPrincipalsResponse.accounts[0].accountCdDomainId,
        "usergroup": userPrincipalsResponse.streamerInfo.userGroup,
        "accesslevel": userPrincipalsResponse.streamerInfo.accessLevel,
        "authorized": "Y",
        "timestamp": tokenTimeStampAsMs,
        "appid": userPrincipalsResponse.streamerInfo.appId,
        "acl": userPrincipalsResponse.streamerInfo.acl
    }

    gLoginRequest = {
        "requests": [
            {
                "service": "ADMIN",
                "command": "LOGIN",
                "requestid": 0,
                "account": userPrincipalsResponse.accounts[0].accountId,
                "source": userPrincipalsResponse.streamerInfo.appId,
                "parameters": {
                    "credential": jsonToQueryString(credentials),
                    "token": userPrincipalsResponse.streamerInfo.token,
                    "version": "1.0"
                }
            }
        ]
    }

    mySock = new WebSocket("wss://" + userPrincipalsResponse.streamerInfo.streamerSocketUrl + "/ws");
    mySock.onmessage = function (evt) {
        if (evt.data != "") {
            let oData = myJSON.parse(evt.data);
            if (!isUndefined(oData.response)) {
                if (oData.response.length > 0) {
                    if (oData.response[0].service == "ADMIN") {
                        if (oData.response[0].command == "LOGIN") {
                            if (oData.response[0].content.code == 0) {
                                //document.getElementById("spanDebug").innerHTML = "Login Success";
                                gbLoggedIn = true;
                            } else {
                                //document.getElementById("spanDebug").innerHTML = oData.response[0].content.msg;
                                showTDAPIError(oData.response[0].content.msg);
                            }
                        }
                    } else {
                        if (oData.response[0].content.code != 0) {
                            showTDAPIError("(" + oData.response[0].content.code + ")" + oData.response[0].content.msg);
                        }
                        //document.getElementById("spanDebug").innerHTML = oData.response[0].content.msg;
                    }
                }
            } else if (!isUndefined(oData.notify)) {
                if (oData.notify.length > 0) {
                    if (!isUndefined(oData.notify[0].heartbeat)) {
                        //document.getElementById("spanDebug").innerHTML = "Notify - heartbeat";
                    } else {
                        if (!isUndefined(oData.notify[0].content.code)) {
                            if (oData.notify[0].content.code == 12) {
                                document.getElementById("spanDebug").innerHTML = "Stock prices no longer being streamed due to logon to the same account.";
                            } else {
                                showTDAPIError("Notify - (" + oData.notify[0].content.code + ") " + oData.notify[0].content.msg);
                            }
                        }
                    }
                }
            } else if (!isUndefined(oData.data)) {
                if (oData.data.length > 0) {
                    //let sDebugMsg = "";
                    //let sDebugMsgSep = "";
                    for (let idxData = 0; idxData < oData.data.length; idxData++) {
                        if (oData.data[idxData].service == "QUOTE") {
                            for (let idxContent = 0; idxContent < oData.data[idxData].content.length; idxContent++) {
                                if (!isUndefined(oMDQ[oData.data[idxData].content[idxContent].key])) {
                                    let oT = oMDQ[oData.data[idxData].content[idxContent].key];
                                    //update oMDQ
                                    for (let ky in oData.data[idxData].content[idxContent]) {
                                        if (oData.data[idxData].content[idxContent].hasOwnProperty(ky)) {
                                            switch (ky) {
                                                case "delayed":
                                                    {
                                                        oT.delayed = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "cusip":
                                                    {
                                                        oT.cusip = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "assetMainType":
                                                    {
                                                        oT.assetMainType = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "1": //bidPrice
                                                    {
                                                        oT.bidPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "2": //askPrice
                                                    {
                                                        oT.askPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "3": //lastPrice
                                                    {
                                                        oT.lastPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "4": //bidSize
                                                    {
                                                        oT.bidSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "5": //askSize
                                                    {
                                                        oT.askSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "6": //askId
                                                    {
                                                        oT.askId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "7": //bidId
                                                    {
                                                        oT.bidId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "8": //totalVolume
                                                    {
                                                        oT.totalVolume = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "9": //lastSize
                                                    {
                                                        oT.lastSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "12": //highPrice
                                                    {
                                                        oT.highPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "13": //lowPrice
                                                    {
                                                        oT.lowPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "15": //closePrice
                                                    {
                                                        oT.closePrice = oData.data[idxData].content[idxContent][ky];
                                                        if (oT.closePrice > 0) {
                                                            oT.netPercentChangeInDouble = (oT.netChange / oT.closePrice) * 100.0;
                                                            oT.regularMarketPercentChangeInDouble = (oT.regularMarketNetChange / oT.closePrice) * 100.0;
                                                        }
                                                        break;
                                                    }
                                                case "16": //exchange
                                                    {
                                                        oT.exchange = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "17": //marginable
                                                    {
                                                        oT.marginable = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "18": //shortable
                                                    {
                                                        oT.shortable = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "24": //volatility
                                                    {
                                                        oT.volatility = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "26": //lastId
                                                    {
                                                        oT.lastId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "27": //digits
                                                    {
                                                        oT.digits = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "28": //openPrice
                                                    {
                                                        oT.openPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "29": //netChange
                                                    {
                                                        oT.netChange = oData.data[idxData].content[idxContent][ky];
                                                        if (oT.closePrice > 0) {
                                                            oT.netPercentChangeInDouble = (oT.netChange / oT.closePrice) * 100.0;
                                                        }
                                                        break;
                                                    }
                                                case "30": //52WkHigh
                                                    {
                                                        oT["52WkHigh"] = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "31": //52WkLow
                                                    {
                                                        oT["52WkLow"] = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "32": //peRatio
                                                    {
                                                        oT.peRatio = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "33": //divAmount
                                                    {
                                                        oT.divAmount = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "34": //divYield
                                                    {
                                                        oT.divYield = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "39": //exchangeName
                                                    {
                                                        oT.exchangeName = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "40": //divDate
                                                    {
                                                        oT.divDate = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "43": //regularMarketLastPrice
                                                    {
                                                        oT.regularMarketLastPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "44": //regularMarketLastSize
                                                    {
                                                        oT.regularMarketLastSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "47": //regularMarketNetChange
                                                    {
                                                        oT.regularMarketNetChange = oData.data[idxData].content[idxContent][ky];
                                                        if (oT.closePrice > 0) {
                                                            oT.regularMarketPercentChangeInDouble = (oT.regularMarketNetChange / oT.closePrice) * 100.0;
                                                        }
                                                        break;
                                                    }
                                                case "48": //securityStatus
                                                    {
                                                        oT.securityStatus = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "49": //mark
                                                    {
                                                        oT.mark = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "50": //quoteTimeInLong
                                                    {
                                                        oT.quoteTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "51": //tradeTimeInLong
                                                    {
                                                        oT.tradeTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "52": //regularMarketTradeTimeInLong
                                                    {
                                                        oT.regularMarketTradeTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                            }
                                        }
                                    }
                                    //oMDQ[oData.data[idxData].content[idxContent].key] = oT;

                                } else {
                                    //add to oMDQ
                                    let oT = {
                                        "symbol": "",
                                        "description": "",
                                        "assetType": "",
                                        "assetMainType": "",
                                        "bidPrice": 0,
                                        "bidSize": 0,
                                        "bidId": "",
                                        "askPrice": 0,
                                        "askSize": 0,
                                        "askId": "",
                                        "lastPrice": 0,
                                        "lastSize": 0,
                                        "lastId": "",
                                        "openPrice": 0,
                                        "highPrice": 0,
                                        "lowPrice": 0,
                                        "closePrice": 0,
                                        "netChange": 0,
                                        "totalVolume": 0,
                                        "quoteTimeInLong": 0,
                                        "tradeTimeInLong": 0,
                                        "mark": 0,
                                        "exchange": "",
                                        "exchangeName": "",
                                        "marginable": false,
                                        "shortable": false,
                                        "volatility": 0,
                                        "digits": 0,
                                        "52WkHigh": 0,
                                        "52WkLow": 0,
                                        "peRatio": 0,
                                        "divAmount": 0,
                                        "divYield": 0,
                                        "divDate": "",
                                        "securityStatus": "",
                                        "regularMarketLastPrice": 0,
                                        "regularMarketLastSize": 0,
                                        "regularMarketNetChange": 0,
                                        "regularMarketTradeTimeInLong": 0
                                    }

                                    for (let ky in oData.data[idxData].content[idxContent]) {
                                        if (oData.data[idxData].content[idxContent].hasOwnProperty(ky)) {
                                            switch (ky) {
                                                case "key":
                                                    {
                                                        oT.symbol = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "delayed":
                                                    {
                                                        oT.delayed = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "cusip":
                                                    {
                                                        oT.cusip = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "assetMainType":
                                                    {
                                                        oT.assetType = oData.data[idxData].content[idxContent][ky];
                                                        oT.assetMainType = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "1": //bidPrice
                                                    {
                                                        oT.bidPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "2": //askPrice
                                                    {
                                                        oT.askPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "3": //lastPrice
                                                    {
                                                        oT.lastPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "4": //bidSize
                                                    {
                                                        oT.bidSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "5": //askSize
                                                    {
                                                        oT.askSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "6": //askId
                                                    {
                                                        oT.askId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "7": //bidId
                                                    {
                                                        oT.bidId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "8": //totalVolume
                                                    {
                                                        oT.totalVolume = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "9": //lastSize
                                                    {
                                                        oT.lastSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "12": //highPrice
                                                    {
                                                        oT.highPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "13": //lowPrice
                                                    {
                                                        oT.lowPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "15": //closePrice
                                                    {
                                                        oT.closePrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "16": //exchange
                                                    {
                                                        oT.exchange = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "17": //marginable
                                                    {
                                                        oT.marginable = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "18": //shortable
                                                    {
                                                        oT.shortable = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "24": //volatility
                                                    {
                                                        oT.volatility = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "26": //lastId
                                                    {
                                                        oT.lastId = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "27": //digits
                                                    {
                                                        oT.digits = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "28": //openPrice
                                                    {
                                                        oT.openPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "29": //netChange
                                                    {
                                                        oT.netChange = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "30": //52WkHigh
                                                    {
                                                        oT["52WkHigh"] = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "31": //52WkLow
                                                    {
                                                        oT["52WkLow"] = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "32": //peRatio
                                                    {
                                                        oT.peRatio = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "33": //divAmount
                                                    {
                                                        oT.divAmount = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "34": //divYield
                                                    {
                                                        oT.divYield = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "39": //exchangeName
                                                    {
                                                        oT.exchangeName = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "40": //divDate
                                                    {
                                                        oT.divDate = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "43": //regularMarketLastPrice
                                                    {
                                                        oT.regularMarketLastPrice = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "44": //regularMarketLastSize
                                                    {
                                                        oT.regularMarketLastSize = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "47": //regularMarketNetChange
                                                    {
                                                        oT.regularMarketNetChange = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "48": //securityStatus
                                                    {
                                                        oT.securityStatus = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "49": //mark
                                                    {
                                                        oT.mark = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "50": //quoteTimeInLong
                                                    {
                                                        oT.quoteTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "51": //tradeTimeInLong
                                                    {
                                                        oT.tradeTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "52": //regularMarketTradeTimeInLong
                                                    {
                                                        oT.regularMarketTradeTimeInLong = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                            }
                                        }
                                    }

                                    oMDQ[oData.data[idxData].content[idxContent].key] = oT;

                                    //sDebugMsg = sDebugMsg + sDebugMsgSep + oData.data[idxData].content[idxContent].key;
                                    //for (let ky in oData.data[idxData].content[idxContent]) {
                                    //    if (oData.data[idxData].content[idxContent].hasOwnProperty(ky)) {
                                    //        sDebugMsg = sDebugMsg + "  " + ky + " -> " + oData.data[idxData].content[idxContent][ky];
                                    //    }
                                    //}
                                    //sDebugMsgSep = ", ";

                                }
                            }
                        } else if (oData.data[idxData].service == "LEVELONE_FUTURES") {
                            for (let idxContent = 0; idxContent < oData.data[idxData].content.length; idxContent++) {
                                if (!isUndefined(oMDQ[oData.data[idxData].content[idxContent].key])) {
                                    let oT = oMDQ[oData.data[idxData].content[idxContent].key];
                                    //update oMDQ
                                    for (let ky in oData.data[idxData].content[idxContent]) {
                                        if (oData.data[idxData].content[idxContent].hasOwnProperty(ky)) {
                                            switch (ky) {
                                                case "delayed":
                                                    {
                                                        oT.delayed = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "3": //lastPrice
                                                    {
                                                        oT.lastPriceInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "14": //closePrice
                                                    {
                                                        oT.closePriceInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "19": //netChange
                                                    {
                                                        oT.changeInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                            }
                                        }
                                    }
                                    //oMDQ[oData.data[idxData].content[idxContent].key] = oT;

                                } else {
                                    //add to oMDQ
                                    let oT = {
                                        "symbol": "",
                                        "description": "",
                                        "assetType": "",
                                        "assetMainType": "",
                                        "lastPriceInDouble": 0,
                                        "closePriceInDouble": 0,
                                        "changeInDouble": "",
                                    }

                                    for (let ky in oData.data[idxData].content[idxContent]) {
                                        if (oData.data[idxData].content[idxContent].hasOwnProperty(ky)) {
                                            switch (ky) {
                                                case "key":
                                                    {
                                                        oT.symbol = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "delayed":
                                                    {
                                                        oT.delayed = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "3": //lastPrice
                                                    {
                                                        oT.lastPriceInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "14": //closePrice
                                                    {
                                                        oT.closePriceInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                                case "19": //netChange
                                                    {
                                                        oT.changeInDouble = oData.data[idxData].content[idxContent][ky];
                                                        break;
                                                    }
                                            }
                                        }
                                    }
                                    oMDQ[oData.data[idxData].content[idxContent].key] = oT;
                                }
                            }
                        }
                    }
                    //if (sDebugMsg != "") {
                    //    document.getElementById("spanDebug").innerHTML = "Data returned - " + sDebugMsg;
                    //}
                }
            }
        }
    };
    mySock.onclose = function () {
        //document.getElementById("spanDebug").innerHTML = "Socket closed";
    };
    mySock.onopen = function () {
        //document.getElementById("spanDebug").innerHTML = "Socket opened";
        mySock.send(myJSON.stringify(gLoginRequest));
    };

}

function PageLoad() {
    //debugger
    //determine if production or test or localhost
    let sBearerCode = location.search;
//    alert("sBearerCode = " + sBearerCode);
    try {
        let sTmp = sBearerCode.substr(0, "?code=".length);
        if (sTmp == "?code=") {
            let sBefore = gsRedirectURL;
            gsRedirectURL = location.protocol + "//" + location.host + location.pathname;
            gsTDAPIKey = "5V5GTTHEURLAUGI2JAFC06QKAIVPAVYF"; //MyGainLoss2
            switch (location.protocol + "//" + location.host + location.pathname) {
                case "https://bhalp.github.io/mySite/default.htm":
                    {
                        break;
                    }
                case "https://bhalp.github.io/mySiteTest/default.htm":
                    {
                        break;
                    }
                case "https://bhalp.github.io/mySite/defaultCell.htm":
                    {
                        gbUsingCell = true;
                        break;
                    }
                case "https://bhalp.github.io/mySiteTest/defaultCell.htm":
                    {
                        gbUsingCell = true;
                        break;
                    }
                case "https://localhost:8080/":
                    {
                        gsRedirectURL = "https://localhost:8080";
                        gsTDAPIKey = "VTBLS2XWYV8HCIHN8JSTSHEZTFZXNI93"; //MyGainLoss
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            //alert("gsRedirectURL before = " + sBefore + "\n" + "gsRedirectURL after = " + gsRedirectURL);
            gsBearerCode = sBearerCode.split('=')[1];
        } else {
            let sBefore = gsRedirectURL;
            gsRedirectURL = location.protocol + "//" + location.host + location.pathname;
            switch (location.protocol + "//" + location.host + location.pathname) {
                case "https://bhalp.github.io/mySite/default.htm":
                    {
                        break;
                    }
                case "https://bhalp.github.io/mySiteTest/default.htm":
                    {
                        break;
                    }
                case "https://bhalp.github.io/mySite/defaultCell.htm":
                    {
                        gbUsingCell = true;
                        break;
                    }
                case "https://bhalp.github.io/mySiteTest/defaultCell.htm":
                    {
                        gbUsingCell = true;
                        break;
                    }
                case "https://localhost:8080/":
                    {
                        gsRedirectURL = "https://localhost:8080";
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            //alert("gsRedirectURL before = " + sBefore + "\n" + "gsRedirectURL after = " + gsRedirectURL);
            let sParams = sBearerCode.split('&');
            gsAccess_token_expiration_time = sParams[0].split('=')[1];
            gsRefreshToken = sParams[1].split('=')[1];
            if (sParams.length == 3) {
                switch (sParams[2].split('=')[1]) {
                    case "1": // APIKey = "VTBLS2XWYV8HCIHN8JSTSHEZTFZXNI93"
                        {
                            gsTDAPIKey = "VTBLS2XWYV8HCIHN8JSTSHEZTFZXNI93"; //MyGainLoss
                            break;
                        }
                    case "2": // APIKey = "5V5GTTHEURLAUGI2JAFC06QKAIVPAVYF"
                        {
                            gsTDAPIKey = "5V5GTTHEURLAUGI2JAFC06QKAIVPAVYF"; //MyGainLoss2
                            break;
                        }
                    default:
                        {
                            gsTDAPIKey = "VTBLS2XWYV8HCIHN8JSTSHEZTFZXNI93"; //MyGainLoss
                            break;
                        }
                }
            } else {
                gsTDAPIKey = "VTBLS2XWYV8HCIHN8JSTSHEZTFZXNI93"; //MyGainLoss
            }
        }
    } catch (e1) {
        gsBearerCode = "";
        gsAccess_token_expiration_time = "";
        gsRefreshToken = "";
        gsTDAPIKey = "";
    }

    document.getElementById("TheBody").style.backgroundColor = gsBodyBackgroundColor;
    let sTmp = ""
    if (gbUsingCell) {
        document.getElementById("spanInfo").style.display = "inline";
        sTmp = "<table style=\"border-collapse:collapse; border: 0px solid black; width:400px;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

        sTmp = sTmp + "<tr height=\"20\">";
        sTmp = sTmp + "<td><input type=\"checkbox\" id=\"chkIndexDJI\" name=\"chkIndexDJI\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexDJI\"> Dow</label>" +
            "<td><input type=\"checkbox\" id=\"chkIndexNasdaq\" name=\"chkIndexNasdaq\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexNasdaq\"> Nasdaq</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexSP\" name=\"chkIndexSP\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexSP\"> S&P 500</label>" + "</td>" +
            "<td>" + "&nbsp;" + "</td>" +
            "</tr>" +
            "<tr height =\"20\">" +
            "<td><input type=\"checkbox\" id=\"chkIndexLargeBio\" name=\"chkIndexLargeBio\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexLargeBio\"> Large Bio</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexSmallBio\" name=\"chkIndexSmallBio\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexSmallBio\"> Small Bio</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexRussell2000\" name=\"chkIndexRussell2000\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexRussell2000\"> Russell 2K</label>" + "</td>" +
            "<td>" + "&nbsp;" + "</td>" +
            "</tr>" +
            "<tr height =\"20\">" +
            "<td><input type=\"checkbox\" id=\"chkIndexNasdaq100\" name=\"chkIndexNasdaq100\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexNasdaq100\"> Nasdaq 100</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndex10yrTreasury\" name=\"chkIndex10yrTreasury\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndex10yrTreasury\"> 10yr Treas</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexOilGas\" name=\"chkIndexOilGas\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexOilGas\"> Oil & Gas</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexOther\" name=\"chkIndexOther\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexOther\"> Other</label>" + "</td>" +
            "</tr>" +
            "<tr height =\"40\">" +
            "<td colspan=4>" + 
            "<input type=\"button\" style=\"vertical-align:middle; border-radius:15px; visibility:visible;\" id=\"btnWLSelect\" name=\"btnWLSelect\" value=\"Select Watchlists\" onclick=\"SelectWatchlist()\">" +
            "&nbsp;" +
            "<input type=\"button\" style=\"vertical-align:middle; border-radius:15px;\" id=\"btnWLReset\" name=\"btnWLReset\" value=\"Reset Watchlists\" onclick=\"ResetWatchlist()\">" +
            "</td>" + 
            "</tr>" +
            "</table>" + 
            "<div id=\"spanIndexes\" style=\"display:none; font-size:10pt;\">" +
            "Index or stock symbols separated by commas:" +
            "<br />" +
            "<input id=\"txtIndexes\" name=\"txtIndexes\" type=\"search\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:10pt;width:300px\" value=\"\">" +
            "</div>";
    } else {
        sTmp = "<table style=\"border-collapse:collapse; border: 0px solid black; width:600px;border-width:0px;font-family:Arial, Helvetica, sans-serif; font-size:10pt;\">";

        sTmp = sTmp + "<tr height=\"20\">";
        sTmp = sTmp + "<td><input type=\"checkbox\" id=\"chkIndexDJI\" name=\"chkIndexDJI\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexDJI\"> Dow</label>" +
            "<td><input type=\"checkbox\" id=\"chkIndexNasdaq\" name=\"chkIndexNasdaq\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexNasdaq\"> Nasdaq</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexSP\" name=\"chkIndexSP\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexSP\"> S&P 500</label>" + "</td>" +
            "<td>" + 
            "<input type=\"button\" style=\"border-radius:15px; visibility:visible;\" id=\"btnWLSelect\" name=\"btnWLSelect\" value=\"Select Watchlists\" onclick=\"SelectWatchlist()\">" +
            "</td>" +
            "<td>" +
            "<input type=\"button\" style=\"border-radius:15px;\" id=\"btnWLReset\" name=\"btnWLReset\" value=\"Reset Watchlists\" onclick=\"ResetWatchlist()\">" +
            "</td>" +
            "</tr>" +
            "<tr height =\"20\">" +
            "<td><input type=\"checkbox\" id=\"chkIndexLargeBio\" name=\"chkIndexLargeBio\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexLargeBio\"> Large Bio</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexSmallBio\" name=\"chkIndexSmallBio\" value=\"\" checked onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexSmallBio\"> Small Bio</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexRussell2000\" name=\"chkIndexRussell2000\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexRussell2000\"> Russell 2K</label>" + "</td>" + 
            "<td>" + "&nbsp;" + "</td>" +
            "<td>" + "&nbsp;" + "</td>" +
            "</tr>" +
            "<tr height =\"20\">" +
            "<td><input type=\"checkbox\" id=\"chkIndexNasdaq100\" name=\"chkIndexNasdaq100\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexNasdaq100\"> Nasdaq 100</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndex10yrTreasury\" name=\"chkIndex10yrTreasury\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndex10yrTreasury\"> 10yr Treas</label>" + "</td>" +
            "<td><input type=\"checkbox\" id=\"chkIndexOilGas\" name=\"chkIndexOilGas\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexOilGas\"> Oil & Gas</label>" + "</td>" + 
            "<td><input type=\"checkbox\" id=\"chkIndexOther\" name=\"chkIndexOther\" value=\"\" onclick=\"chkIndexChanged(event)\">" +
            "<label for=\"chkIndexOther\"> Other</label>" + "</td>" +
            "<td>" + "&nbsp;" + "</td>" +
            "</tr>" +
            "</table><div id=\"spanIndexes\" style=\"display:none; font-size:10pt;\">" +
            "Index or stock symbols separated by commas:" +
            "<br />" +
            "<input id=\"txtIndexes\" name=\"txtIndexes\" type=\"search\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:10pt;width:300px\" value=\"\">" +
            "</div>";
    }
    document.getElementById("tdIndexes").innerHTML = sTmp;

    //setup fixed price array
    let oFixedPrice = new FixedPrice();
    oFixedPrice.symbol = "GNL";
    oFixedPrice.price = 13.75;
    oFixedPrice.date = "2020-04-13";
    gaFixedPrices[gaFixedPrices.length] = oFixedPrice;
    oFixedPrice = new FixedPrice();
    oFixedPrice.symbol = "AFIN";
    oFixedPrice.price = 6.76;
    oFixedPrice.date = "2020-04-13";
    gaFixedPrices[gaFixedPrices.length] = oFixedPrice;

    // set markets to track
    let sCookie = getCookie(gsMarketCookieName);
    if (sCookie != null) {
        //before V6.7 cookie should contain (required) dji active (true or false)
        //                      (required) nasdaq active(true or false)
        //                      (required) s & p active(true or false)
        //                      (required) Large Bio active(true or false)
        //                      (required) Small Bio active(true or false)
        //                      (required) Start Date like 2020-01-01
        //                      (optional)symbol / desc, symbol / desc
        //after V6.6 cookie should contain (required) dji active (true or false)
        //                      (required) nasdaq active(true or false)
        //                      (required) s & p active(true or false)
        //                      (required) Large Bio active(true or false)
        //                      (required) Small Bio active(true or false)
        //                      (required) Russell 2000 active(true or false)
        //                      (required) Nasdaq 100 active(true or false)
        //                      (required) 10yr Treasury active(true or false)
        //                      (required) Oil & Gas active(true or false)
        //                      (required) Start Date like 2020-01-01
        //                      (optional)symbol / desc, symbol / desc
        // e.g. true,true,true,true,true,2020-01-01 or false,true,false,true,true,2020-01-01,aapl/Apple etc.
        let sTmp = sCookie.split(",");
        if (sTmp.length > 0) {
            if (sTmp.length > 9) {
                if (sTmp[0] == "true") {
                    document.getElementById("chkIndexDJI").checked = true;
                } else {
                    document.getElementById("chkIndexDJI").checked = false;
                }
                if (sTmp[1] == "true") {
                    document.getElementById("chkIndexNasdaq").checked = true;
                } else {
                    document.getElementById("chkIndexNasdaq").checked = false;
                }
                if (sTmp[2] == "true") {
                    document.getElementById("chkIndexSP").checked = true;
                } else {
                    document.getElementById("chkIndexSP").checked = false;
                }
                if (sTmp[3] == "true") {
                    document.getElementById("chkIndexLargeBio").checked = true;
                } else {
                    document.getElementById("chkIndexLargeBio").checked = false;
                }
                if (sTmp[4] == "true") {
                    document.getElementById("chkIndexSmallBio").checked = true;
                } else {
                    document.getElementById("chkIndexSmallBio").checked = false;
                }
                if (sTmp[5] == "true") {
                    document.getElementById("chkIndexRussell2000").checked = true;
                } else {
                    document.getElementById("chkIndexRussell2000").checked = false;
                }
                if (sTmp[6] == "true") {
                    document.getElementById("chkIndexNasdaq100").checked = true;
                } else {
                    document.getElementById("chkIndexNasdaq100").checked = false;
                }
                if (sTmp[7] == "true") {
                    document.getElementById("chkIndex10yrTreasury").checked = true;
                } else {
                    document.getElementById("chkIndex10yrTreasury").checked = false;
                }
                if (sTmp[8] == "true") {
                    document.getElementById("chkIndexOilGas").checked = true;
                } else {
                    document.getElementById("chkIndexOilGas").checked = false;
                }
                if (sTmp[9] != "") {
                    document.pwdForm.txtStartDate.value = sTmp[9];
                } else {
                    document.pwdForm.txtStartDate.value = gsInitialStartDate;
                }
                if (sTmp.length > 10) {
                    document.getElementById("chkIndexOther").checked = true;
                    document.getElementById("spanIndexes").style.display = "block";
                    let sOtherIndexesSep = "";
                    let sIndexes = "";
                    for (let idx = 10; idx < sTmp.length; idx++) {
                        sIndexes = sIndexes + sOtherIndexesSep + sTmp[idx];
                        sOtherIndexesSep = ",";
                    }
                    document.getElementById("txtIndexes").value = sIndexes;
                } else {
                    document.getElementById("chkIndexOther").checked = false;
                    document.getElementById("txtIndexes").value = "";
                }
            } else if (sTmp.length > 5) {
                if (sTmp[0] == "true") {
                    document.getElementById("chkIndexDJI").checked = true;
                } else {
                    document.getElementById("chkIndexDJI").checked = false;
                }
                if (sTmp[1] == "true") {
                    document.getElementById("chkIndexNasdaq").checked = true;
                } else {
                    document.getElementById("chkIndexNasdaq").checked = false;
                }
                if (sTmp[2] == "true") {
                    document.getElementById("chkIndexSP").checked = true;
                } else {
                    document.getElementById("chkIndexSP").checked = false;
                }
                if (sTmp[3] == "true") {
                    document.getElementById("chkIndexLargeBio").checked = true;
                } else {
                    document.getElementById("chkIndexLargeBio").checked = false;
                }
                if (sTmp[4] == "true") {
                    document.getElementById("chkIndexSmallBio").checked = true;
                } else {
                    document.getElementById("chkIndexSmallBio").checked = false;
                }
                if (sTmp[5] != "") {
                    document.pwdForm.txtStartDate.value = sTmp[5];
                } else {
                    document.pwdForm.txtStartDate.value = gsInitialStartDate;
                }
                if (sTmp.length > 6) {
                    document.getElementById("chkIndexOther").checked = true;
                    document.getElementById("spanIndexes").style.display = "block";
                    let sOtherIndexesSep = "";
                    let sIndexes = "";
                    for (let idx = 6; idx < sTmp.length; idx++) {
                        sIndexes = sIndexes + sOtherIndexesSep + sTmp[idx];
                        sOtherIndexesSep = ",";
                    }
                    document.getElementById("txtIndexes").value = sIndexes;
                } else {
                    document.getElementById("chkIndexOther").checked = false;
                    document.getElementById("txtIndexes").value = "";
                }
            } else {
                gsMarketsCurrentIndexes = "";
                document.pwdForm.txtStartDate.value = gsInitialStartDate;
            }
        } else {
            gsMarketsCurrentIndexes = "";
            document.pwdForm.txtStartDate.value = gsInitialStartDate;
        }
    }
    //SetupIndexes();

    //alert("gsAccessToken = " + gsAccessToken);
    document.getElementById("txtSymbols").focus();
    document.getElementById("txtEndDate").value = FormatCurrentDateForTD();
    SetWait();
    if (gsRefreshToken == "") {
        GetAccessCode();
        //do the following if want to only make changes to one site
        // Simulate an HTTP redirect:
        //            window.location.replace("http://bobsanping.homeip.net:82/tdapp/default.asp?refreshToken=" + DoURLEncode(gAccessToken.refresh_token) + "&expirationTime=" + gAccessToken.expires_in.toString());
    } else {
        gAccessToken.refresh_token = gsRefreshToken;
        gAccessToken.access_token_expiration_time = (new Date()) + parseInt(gsAccessTokenExpirationTime);
        GetAccessCodeUsingRefreshToken();
    }
    GetTDData(true);
    //if (gAccounts.length > 0) {
    //    if (gWatchlists.length > 0) {
    //        SetupWatchlists(false);
    //    }
    //}
    //        GetAccounts();
    //if (gAccounts.length > 0) {
    //    GetWatchlists(false);
    //    if (gWatchlists.length > 0) {
    //        SetupWatchlists(false);
    //        //get the cookie to mark the selected watchlists
    //    }
    //}
    //        document.getElementById("tdLoggedOnAs").innerHTML = "<b>Logged on as: " + gsLogonUser + "</b>&nbsp;Access Token Expiration:&nbsp;" + FormatDateWithTime(new Date((new Date()).getTime() + (gAccessToken.expires_in * 1000)), true, false);
    document.getElementById("spanLoggedOnAs").innerHTML = "<b>Logged on as: " + gsLogonUser + "</b>";
    SetDefault();
    //DoGetIndexValues();
    //DoGetWatchlistPrices();
    drag_div("spanWL");
    drag_divPH("tblSymbols");
    drag_divPH("tblDetail");
}

function PostSODelete(sAccountId, sData) {
    let iTryCount = 0;
    let iReturn = 0;

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------

        let xhttp = null;
        let iInnerTryCount = 0;

        let sServerURL = "https://api.tdameritrade.com/v1/accounts/" + sAccountId + "/savedorders/" + sData;

        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenDelete(xhttp, sServerURL, "Error during xhttp.open to " + sServerURL, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);

            // send the request
            try {
                //debugger
                xhttp.send();
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        let oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIErrorNoErrorDisplayed(oCM)) {
                            case 0: //no error
                                {
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                        iReturn = 1;
                                        iTryCount = 2;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    iReturn = 2;
                                    iTryCount = 2;
                                    gsLastError = oCM.error;
                                    break;
                                }
                            default:
                                {
                                    iReturn = 3;
                                    iTryCount = 2;
                                    break;
                                }
                        }
                    }
                    else {
                        iReturn = 0; //success
                        iTryCount = 2;
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        iReturn = 5;
                        gsLastError = "HTTP response is null.";
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    //alert("PostTDOrder Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                    iReturn = 6;
                    gsLastError = e1.message;
                }
            }
        }
        else {
            iReturn = 7; //error during HTTP open request
            gsLastError = "Error during HTTP open request";
            iTryCount = 2;
            break;
        }
    }

    return iReturn;
}

function PostTDOrder(sAccountId, sData) {
    //sType = BUY, SELL, TRAILING STOP
    let iTryCount = 0;
    let iReturn = 0;

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------

        let xhttp = null;
        let iInnerTryCount = 0;

        let sServerURL = "https://api.tdameritrade.com/v1/accounts/" + sAccountId + "/savedorders";

        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpen(xhttp, sServerURL, "Error during xhttp.open to " + sServerURL, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);
            xhttp.setRequestHeader("Content-Type", "application/json");

            // send the request
            try {
                //debugger
                xhttp.send(sData);
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        let oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIErrorNoErrorDisplayed(oCM)) {
                            case 0: //no error
                                {
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                        iReturn = 1;
                                        iTryCount = 2;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    iReturn = 2;
                                    iTryCount = 2;
                                    gsLastError = oCM.error;
                                    break;
                                }
                            default:
                                {
                                    iReturn = 3;
                                    iTryCount = 2;
                                    break;
                                }
                        }
                    }
                    else {
                        iReturn = 0; //success
                        iTryCount = 2;
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        iReturn = 5;
                        gsLastError = "HTTP response is null.";
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    //alert("PostTDOrder Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                    iReturn = 6;
                    gsLastError = e1.message;
                }
            }
        }
        else {
            iReturn = 7; //error during HTTP open request
            gsLastError = "Error during HTTP open request";
            iTryCount = 2;
            break;
        }
    }

    return iReturn;
}

function PostTDWLOrder(sAccountId, sWatchlistId, sData) {
    let iTryCount = 0;
    let iReturn = 0;

    iTryCount = 0;
    while (iTryCount < 2) {
        //-------------------------------------------------------------------------------------------------

        let xhttp = null;
        let iInnerTryCount = 0;
        let sServerURL = "https://api.tdameritrade.com/v1/accounts/" + sAccountId + "/watchlists/" + sWatchlistId;

        xhttp = oHTTP();
        while ((xhttp == null) && (iInnerTryCount < 5)) {
            xhttp = oHTTP();
            iInnerTryCount = iInnerTryCount + 1;
        }
        iInnerTryCount = 0;
        if (CheckHTTPOpenPatch(xhttp, sServerURL, "Error during xhttp.open to " + sServerURL, false, false, "", "")) {
            // set the request header
            xhttp.setRequestHeader("AUTHORIZATION", "Bearer " + gAccessToken.access_token);
            xhttp.setRequestHeader("Content-Type", "application/json");

            // send the request
            try {
                //debugger
                xhttp.send(sData);
                if (xhttp.responseText != null) {
                    if (xhttp.responseText != "") {
                        let oCM = myJSON.parse(xhttp.responseText);
                        switch (checkTDAPIErrorNoErrorDisplayed(oCM)) {
                            case 0: //no error
                                {
                                    break;
                                }
                            case 1: //acces code expired
                                {
                                    xhttp = null;
                                    if (GetAccessCodeUsingRefreshToken()) {
                                        iTryCount++;
                                    } else {
                                        alert("An error occurred attempting to refresh the access code. Please reload the app.");
                                        iReturn = 1;
                                        iTryCount = 2;
                                    }
                                    break;
                                }
                            case 2: //other error
                                {
                                    iReturn = 2;
                                    iTryCount = 2;
                                    gsLastError = oCM.error;
                                    break;
                                }
                            default:
                                {
                                    iReturn = 3;
                                    iTryCount = 2;
                                    break;
                                }
                        }
                    }
                    else {
                        iReturn = 0; //success
                        iTryCount = 2;
                    }
                }
                else {
                    iTryCount++;
                    if (iTryCount < 2) {
                        xhttp = null;
                    }
                    else {
                        iReturn = 5;
                        gsLastError = "HTTP response is null.";
                    }
                }
            }
            catch (e1) {
                //debugger
                iTryCount++;
                if (iTryCount < 2) {
                    xhttp = null;
                }
                else {
                    //alert("PostTDOrder Error retrieving data (" + iTryCount.toString() + ") - " + e1.message);
                    iReturn = 6;
                    gsLastError = e1.message;
                }
            }
        }
        else {
            iReturn = 7; //error during HTTP open request
            gsLastError = "Error during HTTP open request";
            iTryCount = 2;
            break;
        }
    }

    return iReturn;
}

function PostWLBuyOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDOrder();
        oTDOrder = gTDOrders[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.a00complexOrderStrategyTypeStart +
                oTDOrder.a02orderType +
                oTDOrder.a03Asession +
                oTDOrder.a04duration +
                oTDOrder.a05orderStrategyType +
                oTDOrder.a06orderLegCollectionStart +
                oTDOrder.a07instructionStart +
                oTDOrder.a08quantity +
                oTDOrder.a09instrumentStart +
                oTDOrder.a10symbol +
                oTDOrder.a11assetType +
                oTDOrder.a12instrumentEnd + oTDOrder.a13instructionEnd + oTDOrder.a14orderLegCollectionEnd + oTDOrder.a15complexOrderStrategyTypeEnd;
            if (PostTDOrder(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDOrders[idxOrder].bProcessed = true;
                if (gTDOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLBuyOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLBuyOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " BUY ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders created";
    } else {
        sMsg = sMsg + "order created";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLBuyOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDOrders.length; idxOrder++) {
                if (!gTDOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDOrders[idxOrder].sError;
                }
            }
            sMsg = sMsg + gsCRLF + "Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        } else {
            sMsg = sMsg + ". Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        }
    }

    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();

}

function PostWLBuyOrdersLimit(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDOrder();
        oTDOrder = gTDOrders[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.a00complexOrderStrategyTypeStart + oTDOrder.a01complexOrderStrategyType +
                oTDOrder.a02orderType +
                oTDOrder.a03AsessionSeamless +
                oTDOrder.a04duration +
                oTDOrder.a03FcancelTime +
                oTDOrder.a02Aprice +
                oTDOrder.a05orderStrategyType +
                oTDOrder.a06orderLegCollectionStart +
                oTDOrder.a07instructionStart +
                oTDOrder.a08quantity +
                oTDOrder.a09instrumentStart +
                oTDOrder.a10symbol +
                oTDOrder.a11assetType +
                oTDOrder.a12instrumentEnd + oTDOrder.a13instructionEnd + oTDOrder.a14orderLegCollectionEnd + oTDOrder.a15complexOrderStrategyTypeEnd;
            if (PostTDOrder(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDOrders[idxOrder].bProcessed = true;
                if (gTDOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLBuyOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLBuyOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " BUY LIMIT ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders created";
    } else {
        sMsg = sMsg + "order created";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLBuyOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDOrders.length; idxOrder++) {
                if (!gTDOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDOrders[idxOrder].sError;
                }
            }
            sMsg = sMsg + gsCRLF + "Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        } else {
            sMsg = sMsg + ". Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        }
    }

    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

function PostWLCloseSymbolOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, sWatchlistId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDWLOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDWLOrder = new TDWLOrder();
        oTDWLOrder = gTDWLOrders[idxOrder];
        if (!oTDWLOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDWLOrder.aWL00Start +
                oTDWLOrder.aWL01name +
                oTDWLOrder.aWL02watchlistId +
                oTDWLOrder.aWL03watchlistItemsStart +
                oTDWLOrder.aWL03watchlistItemStart +
                oTDWLOrder.aWL04sequenceId +
                oTDWLOrder.aWL05quantity +
                oTDWLOrder.aWL06averagePrice +
                oTDWLOrder.aWL07commission +
                oTDWLOrder.aWL08instrumentStart +
                oTDWLOrder.aWL09symbol +
                oTDWLOrder.aWL10assetType +
                oTDWLOrder.aWL11instrumentEnd +
                oTDWLOrder.aWL12watchlistItemEnd +
                oTDWLOrder.aWL12watchlistItemsEnd +
                oTDWLOrder.aWL13end;
            if (PostTDWLOrder(sAccountId, sWatchlistId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDWLOrders[idxOrder].bProcessed = true;
                if (gTDWLOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDWLOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLCloseSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "','" + sWatchlistId + "', " + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDWLOrders[idxOrder].sError = oTDWLOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDWLOrders[idxOrder].sError = oTDWLOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLCloseSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "','" + sWatchlistId + "',  0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " watchlist ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "symbols updated";
    } else {
        sMsg = sMsg + "symbol updated";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLCloseSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDWLOrders.length - 1).toString() + ", '" + sAccountId + "','" + sWatchlistId + "',  0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDWLOrders.length; idxOrder++) {
                if (!gTDWLOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDWLOrders[idxOrder].sError;
                }
            }
            alert(sMsg);
        } else {
            //sMsg = sMsg + ".";
        }
    }

    gbDoResetWatchlists = true;
    if (giGetTDDataTimeoutId != 0) {
        window.clearTimeout(giGetTDDataTimeoutId);
        giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
    }
    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

function PostWLDeleteSymbolOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, sWatchlistId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100;
        //iProgressIncrement = 100 / gTDWLOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    if (giProgress < 100) {
        giProgress = giProgress + iProgressIncrement;
    }
    let sOrder = "";
    let sSep = "";
    for (let idxOrder = 0; idxOrder < gTDWLOrders.length; idxOrder++) {
        let oTDWLOrder = new TDWLOrder();
        oTDWLOrder = gTDWLOrders[idxOrder];
        if (sOrder == "") {
            sOrder = oTDWLOrder.aWL00Start +
                oTDWLOrder.aWL01name +
                oTDWLOrder.aWL02watchlistId +
                oTDWLOrder.aWL03watchlistItemsStart;
        }
        sOrder = sOrder + sSep +
            oTDWLOrder.aWL03watchlistItemStart +
            oTDWLOrder.aWL04sequenceId +
            oTDWLOrder.aWL05quantity +
            oTDWLOrder.aWL06averagePrice +
            oTDWLOrder.aWL07commission +
            oTDWLOrder.aWL07purchasedDate +
            oTDWLOrder.aWL08instrumentStart +
            oTDWLOrder.aWL09symbol +
            oTDWLOrder.aWL10assetType +
            oTDWLOrder.aWL11instrumentEnd +
            oTDWLOrder.aWL12watchlistItemEnd;
        sSep = ",";
    }
    let oTDWLOrder = new TDWLOrder();
    sOrder = sOrder + oTDWLOrder.aWL12watchlistItemsEnd +
        oTDWLOrder.aWL13end;

    if (PostTDWLOrder(sAccountId, sWatchlistId, sOrder) == 0) {
        //success
        iNumSuccess = gTDWLOrders.length;
        let sMsg = iNumSuccess.toString() + " watchlist ";
        if (iNumSuccess > 1) {
            sMsg = sMsg + "symbols deleted";
        } else {
            sMsg = sMsg + "symbol deleted";
        }
        alert(sMsg);
        gbDoResetWatchlists = true;
        if (giGetTDDataTimeoutId != 0) {
            window.clearTimeout(giGetTDDataTimeoutId);
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
        }
        ShowProgress(false, true);
        gbDoingCreateOrders = false;
        SetDefault();
    } else {
        let sMsg = ""
        sMsg = sMsg + "Error deleting symbols -- ";
        sMsg = sMsg + gsLastError;
        alert(sMsg);
        gbDoResetWatchlists = true;
        if (giGetTDDataTimeoutId != 0) {
            window.clearTimeout(giGetTDDataTimeoutId);
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
        }
        ShowProgress(false, true);
        gbDoingCreateOrders = false;
        SetDefault();
    }
}

function PostWLOpenSymbolOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, sWatchlistId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    let bDoingPurchasedDateUpdate = false;
    let bDoingPurchasedDateClear = false;
    let bDoingAddSymbols = false;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100;
        //iProgressIncrement = 100 / gTDWLOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    if (giProgress < 100) {
        giProgress = giProgress + iProgressIncrement;
    }
    let sOrder = "";
    let sSep = "";
    for (let idxOrder = 0; idxOrder < gTDWLOrders.length; idxOrder++) {
        let oTDWLOrder = new TDWLOrder();
        oTDWLOrder = gTDWLOrders[idxOrder];
        if (sOrder == "") {
            if (oTDWLOrder.bDoingPurchasedDateClear) {
                bDoingPurchasedDateClear = true;
            } else if (oTDWLOrder.bDoingPurchasedDateUpdate) {
                bDoingPurchasedDateUpdate = true;
            } else {
                bDoingAddSymbols = true;
            }
            sOrder = oTDWLOrder.aWL00Start +
                oTDWLOrder.aWL01name +
                oTDWLOrder.aWL02watchlistId +
                oTDWLOrder.aWL03watchlistItemsStart;
        }
        sOrder = sOrder + sSep +
            oTDWLOrder.aWL03watchlistItemStart +
            oTDWLOrder.aWL04sequenceId +
            oTDWLOrder.aWL05quantity +
            oTDWLOrder.aWL06averagePrice +
            oTDWLOrder.aWL07commission +
            oTDWLOrder.aWL07purchasedDate +
            oTDWLOrder.aWL08instrumentStart +
            oTDWLOrder.aWL09symbol +
            oTDWLOrder.aWL10assetType +
            oTDWLOrder.aWL11instrumentEnd +
            oTDWLOrder.aWL12watchlistItemEnd;
        sSep = ",";
    }
    let oTDWLOrder = new TDWLOrder();
    sOrder = sOrder + oTDWLOrder.aWL12watchlistItemsEnd +
                      oTDWLOrder.aWL13end;

    if (PostTDWLOrder(sAccountId, sWatchlistId, sOrder) == 0) {
        //success
        if (bDoingPurchasedDateClear) {
            iNumSuccess = gTDWLOrders.length / 2;
        } else if (bDoingPurchasedDateUpdate) {
            iNumSuccess = gTDWLOrders.length;
        } else {
            iNumSuccess = gTDWLOrders.length;
        }
        let sMsg = iNumSuccess.toString() + " watchlist ";
        if (bDoingPurchasedDateUpdate) {
            if (iNumSuccess > 1) {
                sMsg = sMsg + "symbols Acquired Date updated";
            } else {
                sMsg = sMsg + "symbol Acquired Date updated";
            }
        } else if (bDoingPurchasedDateClear) {
            if (iNumSuccess > 1) {
                sMsg = sMsg + "symbols Acquired Date cleared";
            } else {
                sMsg = sMsg + "symbol Acquired Date cleared";
            }
        } else {
            if (iNumSuccess > 1) {
                sMsg = sMsg + "symbols added";
            } else {
                sMsg = sMsg + "symbol added";
            }
        }
        alert(sMsg);
        gbDoResetWatchlists = true;
        if (giGetTDDataTimeoutId != 0) {
            window.clearTimeout(giGetTDDataTimeoutId);
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
        }
        if (iNumErrors == 0) {
            ClearAllWLInputFields(idxWL);
        }
        ShowProgress(false, true);
        gbDoingCreateOrders = false;
        SetDefault();
    } else {
        let sMsg = ""
        if (bDoingPurchasedDateUpdate) {
            sMsg = sMsg + "Error updating Acquired Date -- ";
        } else if (bDoingPurchasedDateClear) {
            sMsg = sMsg + "Error clearing Acquired Date -- ";
        } else {
            sMsg = sMsg + "Error adding new symbols -- ";
        }
        sMsg = sMsg + gsLastError;
        alert(sMsg);
        gbDoResetWatchlists = true;
        if (giGetTDDataTimeoutId != 0) {
            window.clearTimeout(giGetTDDataTimeoutId);
            giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
        }
        ShowProgress(false, true);
        gbDoingCreateOrders = false;
        SetDefault();
    }
    //for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
    //    if (giProgress < 100) {
    //        giProgress = giProgress + iProgressIncrement;
    //    }
    //    let oTDWLOrder = new TDWLOrder();
    //    oTDWLOrder = gTDWLOrders[idxOrder];
    //    if (oTDWLOrder.aWL04sequenceId == "") {
    //        bDoingPurchasedDateUpdate = true;
    //    }
    //    if (!oTDWLOrder.bProcessed) {
    //        let sOrder = "";
    //        sOrder = oTDWLOrder.aWL00Start +
    //            oTDWLOrder.aWL01name +
    //            oTDWLOrder.aWL02watchlistId +
    //            oTDWLOrder.aWL03watchlistItemsStart +
    //            oTDWLOrder.aWL03watchlistItemStart +
    //            oTDWLOrder.aWL04sequenceId +
    //            oTDWLOrder.aWL05quantity +
    //            oTDWLOrder.aWL06averagePrice +
    //            oTDWLOrder.aWL07commission +
    //            oTDWLOrder.aWL07purchasedDate +
    //            oTDWLOrder.aWL08instrumentStart +
    //            oTDWLOrder.aWL09symbol +
    //            oTDWLOrder.aWL10assetType +
    //            oTDWLOrder.aWL11instrumentEnd +
    //            oTDWLOrder.aWL12watchlistItemEnd +
    //            oTDWLOrder.aWL12watchlistItemsEnd +
    //            oTDWLOrder.aWL13end;
    //        if (PostTDWLOrder(sAccountId, sWatchlistId, sOrder) == 0) {
    //            //success
    //            iNumSuccess++;
    //            gTDWLOrders[idxOrder].bProcessed = true;
    //            if (gTDWLOrders[idxOrder].sError != "") {
    //                iNumErrors--;
    //            }
    //            gTDWLOrders[idxOrder].sError = "";
    //        } else {
    //            if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
    //                if (iTryCount < 3) {
    //                    iTryCount++;
    //                    giProgress = giProgress - 1;
    //                    window.setTimeout("PostWLOpenSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "','" + sWatchlistId + "', " + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
    //                    return;
    //                } else {
    //                    // an error occurred
    //                    iNumErrors++;
    //                    gTDWLOrders[idxOrder].sError = oTDWLOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
    //                }
    //            } else {
    //                // an error occurred
    //                iNumErrors++;
    //                gTDWLOrders[idxOrder].sError = oTDWLOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
    //            }
    //        }
    //    }
    //    window.setTimeout("PostWLOpenSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "','" + sWatchlistId + "',  0, " + idxWL.toString() + ")", 200);
    //    return;
    //}
//    let sMsg = iNumSuccess.toString() + " watchlist ";
//    if (bDoingPurchasedDateUpdate) {
//        if (iNumSuccess > 1) {
//            sMsg = sMsg + "symbols updated";
//        } else {
//            sMsg = sMsg + "symbol updated";
//        }
//    } else {
//        if (iNumSuccess > 1) {
//            sMsg = sMsg + "symbols added";
//        } else {
//            sMsg = sMsg + "symbol added";
//        }
//    }
//    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
//        giTDPostOrderRetryCnt++;
//        giProgress = 0;
//        window.setTimeout("PostWLOpenSymbolOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDWLOrders.length - 1).toString() + ", '" + sAccountId + "','" + sWatchlistId + "',  0, " + idxWL.toString() + ")", 4000);
//        return;
//    } else {
//        if (iNumErrors > 0) {
//            sMsg = sMsg + " with the following errors:";
//            for (let idxOrder = 0; idxOrder < gTDWLOrders.length; idxOrder++) {
//                if (!gTDWLOrders[idxOrder].bProcessed) {
//                    sMsg = sMsg + gsCRLF + gTDWLOrders[idxOrder].sError;
//                }
//            }
//            alert(sMsg);
//        } else {
//            //sMsg = sMsg + ".";
//        }
//    }

//    gbDoResetWatchlists = true;
//    if (giGetTDDataTimeoutId != 0) {
//        window.clearTimeout(giGetTDDataTimeoutId);
//        giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 100);
//    }
//    if (iNumErrors == 0) {
//        ClearAllWLInputFields(idxWL);
//    }
//    ShowProgress(false, true);
//    gbDoingCreateOrders = false;
//    SetDefault();
}

function PostWLSellOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDOrder();
        oTDOrder = gTDOrders[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.a00complexOrderStrategyTypeStart + oTDOrder.a01complexOrderStrategyType +
                oTDOrder.a02orderType +
                oTDOrder.a03Asession +
                oTDOrder.a04duration +
                oTDOrder.a05orderStrategyType +
                oTDOrder.a06orderLegCollectionStart +
                oTDOrder.a07instructionStart +
                oTDOrder.a08quantity +
                oTDOrder.a09instrumentStart +
                oTDOrder.a10symbol +
                oTDOrder.a11assetType +
                oTDOrder.a12instrumentEnd + oTDOrder.a13instructionEnd + oTDOrder.a14orderLegCollectionEnd + oTDOrder.a15complexOrderStrategyTypeEnd;
            if (PostTDOrder(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDOrders[idxOrder].bProcessed = true;
                if (gTDOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLSellOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLSellOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " SELL ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders created";
    } else {
        sMsg = sMsg + "order created";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLSellOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDOrders.length; idxOrder++) {
                if (!gTDOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDOrders[idxOrder].sError;
                }
            }
            sMsg = sMsg + gsCRLF + "Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        } else {
            sMsg = sMsg + ". Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        }
    }

    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

function PostWLSellOrdersLimit(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDOrder();
        oTDOrder = gTDOrders[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.a00complexOrderStrategyTypeStart + oTDOrder.a01complexOrderStrategyType +
                oTDOrder.a02orderType +
                oTDOrder.a03AsessionSeamless +
                oTDOrder.a04duration +
                oTDOrder.a03FcancelTime +
                oTDOrder.a02Aprice +
                oTDOrder.a05orderStrategyType +
                oTDOrder.a06orderLegCollectionStart +
                oTDOrder.a07instructionStart +
                oTDOrder.a08quantity +
                oTDOrder.a09instrumentStart +
                oTDOrder.a10symbol +
                oTDOrder.a11assetType +
                oTDOrder.a12instrumentEnd + oTDOrder.a13instructionEnd + oTDOrder.a14orderLegCollectionEnd + oTDOrder.a15complexOrderStrategyTypeEnd;
            if (PostTDOrder(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDOrders[idxOrder].bProcessed = true;
                if (gTDOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLSellOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLSellOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " SELL LIMIT ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders created";
    } else {
        sMsg = sMsg + "order created";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLSellOrdersLimit(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDOrders.length; idxOrder++) {
                if (!gTDOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDOrders[idxOrder].sError;
                }
            }
            alert(sMsg);
        } else {
            sMsg = sMsg + ". Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        }
    }

    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

function PostWLTrailingStopOrders(bFirstTime, iNumSuccessIn, iNumErrorsIn, iProgressIncrementIn, idxOrderStart, sAccountId, iTryCountIn, idxWL) {
    let iNumSuccess = iNumSuccessIn;
    let iNumErrors = iNumErrorsIn;
    let iProgressIncrement = iProgressIncrementIn;
    let iTryCount = iTryCountIn;
    if (bFirstTime) {
        giProgress = 0;
        iProgressIncrement = 100 / gTDOrders.length;
        gsLastErrors.length = 0;
        giTDPostOrderRetryCnt = 0;
        ShowProgress(true, false);
    }
    for (let idxOrder = idxOrderStart; idxOrder > -1; idxOrder--) {
        if (giProgress < 100) {
            giProgress = giProgress + iProgressIncrement;
        }
        let oTDOrder = new TDOrder();
        oTDOrder = gTDOrders[idxOrder];
        if (!oTDOrder.bProcessed) {
            let sOrder = "";
            sOrder = oTDOrder.a00complexOrderStrategyTypeStart + oTDOrder.a01complexOrderStrategyType +
                oTDOrder.a02orderType + oTDOrder.a03FcancelTime +
                oTDOrder.a03Asession + oTDOrder.a03BstopPriceLinkBasis + oTDOrder.a03CstopPriceLinkType + oTDOrder.a03DstopPriceOffset + oTDOrder.a03EstopType +
                oTDOrder.a04duration +
                oTDOrder.a05orderStrategyType +
                oTDOrder.a06orderLegCollectionStart +
                oTDOrder.a07instructionStart +
                oTDOrder.a08quantity +
                oTDOrder.a09instrumentStart +
                oTDOrder.a10symbol +
                oTDOrder.a11assetType +
                oTDOrder.a12instrumentEnd + oTDOrder.a13instructionEnd + oTDOrder.a14orderLegCollectionEnd + oTDOrder.a15complexOrderStrategyTypeEnd;
            if (PostTDOrder(sAccountId, sOrder) == 0) {
                //success
                iNumSuccess++;
                gTDOrders[idxOrder].bProcessed = true;
                if (gTDOrders[idxOrder].sError != "") {
                    iNumErrors--;
                }
                gTDOrders[idxOrder].sError = "";
            } else {
                if (gsLastError.indexOf("Individual App's transactions per seconds restriction reached.") != -1) {
                    if (iTryCount < 3) {
                        iTryCount++;
                        giProgress = giProgress - 1;
                        window.setTimeout("PostWLTrailingStopOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + idxOrder.toString() + ", '" + sAccountId + "'," + iTryCount.toString() + ", " + idxWL.toString() + ")", 3000);
                        return;
                    } else {
                        // an error occurred
                        iNumErrors++;
                        gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                    }
                } else {
                    // an error occurred
                    iNumErrors++;
                    gTDOrders[idxOrder].sError = oTDOrder.symbol + "(" + iTryCount.toString() + ") -- " + gsLastError;
                }
            }
        }
        window.setTimeout("PostWLTrailingStopOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (idxOrder - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 200);
        return;
    }
    let sMsg = iNumSuccess.toString() + " TRAILING STOP ";
    if (iNumSuccess > 1) {
        sMsg = sMsg + "orders created";
    } else {
        sMsg = sMsg + "order created";
    }
    if ((iNumErrors > 0) && (giTDPostOrderRetryCnt < 3)) {
        giTDPostOrderRetryCnt++;
        giProgress = 0;
        window.setTimeout("PostWLTrailingStopOrders(false, " + iNumSuccess.toString() + ", " + iNumErrors.toString() + ", " + iProgressIncrement.toString() + ", " + (gTDOrders.length - 1).toString() + ", '" + sAccountId + "', 0, " + idxWL.toString() + ")", 4000);
        return;
    } else {
        if (iNumErrors > 0) {
            sMsg = sMsg + " with the following errors:";
            for (let idxOrder = 0; idxOrder < gTDOrders.length; idxOrder++) {
                if (!gTDOrders[idxOrder].bProcessed) {
                    sMsg = sMsg + gsCRLF + gTDOrders[idxOrder].sError;
                }
            }
            sMsg = sMsg + gsCRLF + "Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        } else {
            sMsg = sMsg + ". Log in your TD account. Click Trade/Saved Orders to execute these orders.";
            alert(sMsg);
        }
    }

    if (iNumErrors == 0) {
        ClearAllWLInputFields(idxWL);
    }
    ShowProgress(false, true);
    gbDoingCreateOrders = false;
    SetDefault();
}

function printdiv(printdivname) {
    window.setTimeout("printdiv_do('" + printdivname + "')", 300);
}

function printdiv_do(printdivname) {
    let headstr = "<html><head><title>Watchlist Details</title></head><body>";
    let footstr1 = "</"; let footstr2 = "body>"; let footstr = footstr1 + footstr2;
    let newstr = document.getElementById(printdivname).innerHTML;
    let oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    document.body.innerHTML = oldstr;
    window.setTimeout("wlResetDragAllWatchlists()", 1000);
}

function ReportTimeOut() {
    bTimedOut = true;
    window.clearInterval(iTimerID);
    xhttpAsync.abort();
    SetDefault();
    alert("Timeout");
    bDoingLookup = false;
}

function ResetWatchlist() {
    SetWait();
    window.setTimeout("DoResetWatchlists()", 50);
}

function SelectWatchlist() {

    if (gbUsingCell) {
        //get list of watchlists
        if (gWatchlists.length == 0) {
            GetWatchlists(false);
            if (gWatchlists.length > 0) {
                SetupWatchlists(false);
                document.getElementById("pwdForm").style.display = "none";
                document.getElementById("MainForm").style.display = "none";
                wlHideAllWatchlists();
                document.getElementById("wlForm").style.display = "block";
            }
        } else {
            SetupWatchlists(false);
            document.getElementById("pwdForm").style.display = "none";
            document.getElementById("MainForm").style.display = "none";
            wlHideAllWatchlists();
            document.getElementById("wlForm").style.display = "block";
        }
    } else {
        if (gbShowingSelectWatchlists) {
            wlDoCancelPopup();
        } else {
            let dLeft = document.pwdForm.btnWLSelect.getBoundingClientRect().left;
            let dTop = document.pwdForm.btnWLSelect.getBoundingClientRect().top;

            dLeft = dLeft.toFixed(0);
            dTop = dTop.toFixed(0);

            //alert ("sRight = " + sRight.toString());
            document.getElementById("spanWLSelectWatchlists").style.top = dTop.toString() + "px";
            document.getElementById("spanWLSelectWatchlists").style.left = dLeft.toString() + "px";

            //get list of watchlists
            if (gWatchlists.length == 0) {
                GetWatchlists(false);
                if (gWatchlists.length > 0) {
                    SetupWatchlists(false);
                    document.pwdForm.btnWLSelect.style.visibility = "hidden";
                    document.getElementById("spanWLSelectWatchlists").style.visibility = "visible";
                    giZIndex++;
                    document.getElementById("spanWLSelectWatchlists").style.zIndex = giZIndex.toString();
                    gbDoingSymbolsSelect = false;
                    window.setTimeout("wlDoSetShowingSelectWatchlists()", 10);
                }
            } else {
                SetupWatchlists(false);
                document.pwdForm.btnWLSelect.style.visibility = "hidden";
                document.getElementById("spanWLSelectWatchlists").style.visibility = "visible";
                giZIndex++;
                document.getElementById("spanWLSelectWatchlists").style.zIndex = giZIndex.toString();
                gbDoingSymbolsSelect = false;
                window.setTimeout("wlDoSetShowingSelectWatchlists()", 10);
            }
        }
    }

}

function SelectWatchlistSymbols() {

    if (gbUsingCell) {
        //get list of watchlists
        if (gWatchlists.length == 0) {
            GetWatchlists(false);
            if (gWatchlists.length > 0) {
                SetupWatchlists(true);
                document.getElementById("pwdForm").style.display = "none";
                document.getElementById("MainForm").style.display = "none";
                document.getElementById("wlForm").style.display = "block";
                gbDoingSymbolsSelect = true;
            }
        } else {
            SetupWatchlists(true);
            document.getElementById("pwdForm").style.display = "none";
            document.getElementById("MainForm").style.display = "none";
            document.getElementById("wlForm").style.display = "block";
            gbDoingSymbolsSelect = true;
        }
    } else {
        if (gbShowingSelectWatchlists) {
            wlDoCancelPopup();
        } else {
            let dLeft = document.pwdForm.btnSymSelect.getBoundingClientRect().left;
            let dTop = document.pwdForm.btnSymSelect.getBoundingClientRect().top;

            dLeft = dLeft.toFixed(0);
            dTop = dTop.toFixed(0);

            //alert ("sRight = " + sRight.toString());
            document.getElementById("spanWLSelectWatchlists").style.top = dTop.toString() + "px";
            document.getElementById("spanWLSelectWatchlists").style.left = dLeft.toString() + "px";

            //get list of watchlists
            if (gWatchlists.length == 0) {
                GetWatchlists(false);
                if (gWatchlists.length > 0) {
                    SetupWatchlists(true);
                    document.pwdForm.btnSymSelect.style.visibility = "hidden";
                    document.pwdForm.btnSymFind.style.visibility = "hidden";
                    document.getElementById("spanWLSelectWatchlists").style.visibility = "visible";
                    giZIndex++;
                    document.getElementById("spanWLSelectWatchlists").style.zIndex = giZIndex.toString();
                    gbDoingSymbolsSelect = true;
                    window.setTimeout("wlDoSetShowingSelectWatchlists()", 10);
                }
            } else {
                SetupWatchlists(true);
                document.pwdForm.btnSymSelect.style.visibility = "hidden";
                document.pwdForm.btnSymFind.style.visibility = "hidden";
                document.getElementById("spanWLSelectWatchlists").style.visibility = "visible";
                giZIndex++;
                document.getElementById("spanWLSelectWatchlists").style.zIndex = giZIndex.toString();
                gbDoingSymbolsSelect = true;
                window.setTimeout("wlDoSetShowingSelectWatchlists()", 10);
            }
        }
    }
}

function SetCurrentCookie() {
    //before V6.7 cookie should contain (required) dji active (true or false)
    //                      (required) nasdaq active(true or false)
    //                      (required) s & p active(true or false)
    //                      (required) Large Bio active(true or false)
    //                      (required) Small Bio active(true or false)
    //                      (required) Start Date like 2020-01-01
    //                      (optional)symbol / desc, symbol / desc
    //after V6.6 cookie should contain (required) dji active (true or false)
    //                      (required) nasdaq active(true or false)
    //                      (required) s & p active(true or false)
    //                      (required) Large Bio active(true or false)
    //                      (required) Small Bio active(true or false)
    //                      (required) Russell 2000 active(true or false)
    //                      (required) Nasdaq 100 active(true or false)
    //                      (required) 10yr Treasury active(true or false)
    //                      (required) Oil & Gas active(true or false)
    //                      (required) Start Date like 2020-01-01
    //                      (optional)symbol / desc, symbol / desc
    // e.g. true,true,true,true,true,2020-01-01 or false,true,false,true,true,2020-01-01,aapl/Apple etc.

    let sSep = "";
    let sCookie = "";
    if (document.getElementById("chkIndexDJI").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexNasdaq").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexSP").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexLargeBio").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexSmallBio").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }

    if (document.getElementById("chkIndexRussell2000").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexNasdaq100").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndex10yrTreasury").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }
    if (document.getElementById("chkIndexOilGas").checked) {
        sCookie = sCookie + sSep + "true";
        sSep = ","
    } else {
        sCookie = sCookie + sSep + "false";
        sSep = ","
    }

    if (TrimLikeVB(document.pwdForm.txtStartDate.value) != "") {
        sCookie = sCookie + sSep + TrimLikeVB(document.pwdForm.txtStartDate.value);
        sSep = ","
    } else {
        sCookie = sCookie + sSep + gsInitialStartDate;
        sSep = ","
    }
    if (document.getElementById("chkIndexOther").checked && (TrimLikeVB(document.getElementById("txtIndexes").value) != "")) {
        sCookie = sCookie + sSep + document.getElementById("txtIndexes").value;
    }
    return sCookie;
}

function SetCurrentIndexes() {
    let sSep = "";
    gsMarketsCurrentIndexes = "";
    if (document.getElementById("chkIndexDJI").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsDJI + "/" + gsMarketsDJIDesc;
        sSep = ","
    }
    if (document.getElementById("chkIndexNasdaq").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsNasdaq + "/" + gsMarketsNasdaqDesc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexSP").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsSP + "/" + gsMarketsSPDesc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexLargeBio").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsLargeBio + "/" + gsMarketsLargeBioDesc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexSmallBio").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsSmallBio + "/" + gsMarketsSmallBioDesc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexRussell2000").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsRussell2000 + "/" + gsMarketsRussell2000Desc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexNasdaq100").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsNasdaq100 + "/" + gsMarketsNasdaq100Desc;
        sSep = ",";
    }
    if (document.getElementById("chkIndex10yrTreasury").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarkets10yrTreasury + "/" + gsMarkets10yrTreasuryDesc;
        sSep = ",";
    }
    if (document.getElementById("chkIndexOilGas").checked) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + gsMarketsOilGas + "/" + gsMarketsOilGasDesc;
        sSep = ",";
    }

    let sTmp = document.getElementById("txtIndexes").value;
    sTmp = GetUniqueListOfSymbols(sTmp);
    if (document.getElementById("chkIndexOther").checked && (sTmp != "")) {
        gsMarketsCurrentIndexes = gsMarketsCurrentIndexes + sSep + sTmp;
    }
}

function setCookie(name, value, daysToLive) {
    // Encode value in order to escape semicolons, commas, and whitespace
    let cookie = name + "=" + encodeURIComponent(value);

    if (typeof daysToLive === "number") {
        /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
        cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);

        document.cookie = cookie;
    }
}

function SetDefault() {
    if (gbDoingStockPriceHistory) {
        //document.pwdForm.btnGetStockPriceHistoryStop.style.cursor = "auto";
        //document.pwdForm.btnGetStockPriceHistoryStop.disabled = false;

        //document.pwdForm.btnGetStockPriceHistory.value = "Start Price History";

    } else {
        document.body.style.cursor = "auto";
        document.pwdForm.txtSymbols.style.cursor = "auto";
        document.pwdForm.txtSymbols.disabled = false;

        document.pwdForm.btnGetTrades.style.cursor = "auto";
        document.pwdForm.btnGetTrades.disabled = false;

        document.pwdForm.btnGetStockPriceHistory.value = "Start Price History";
        document.pwdForm.btnGetStockPriceHistory.style.cursor = "auto";
        document.pwdForm.btnGetStockPriceHistory.disabled = false;

        //document.pwdForm.btnGetStockPriceHistoryStart.style.cursor = "auto";
        //document.pwdForm.btnGetStockPriceHistoryStart.disabled = false;

        //document.pwdForm.btnGetStockPriceHistoryStop.style.cursor = "wait";
        //document.pwdForm.btnGetStockPriceHistoryStop.disabled = true;

        document.pwdForm.txtShortTime.style.cursor = "auto";
        document.pwdForm.txtShortTime.disabled = false;

        document.pwdForm.txtLongTime.style.cursor = "auto";
        document.pwdForm.txtLongTime.disabled = false;

        document.pwdForm.chkUseExtended.disabled = false;
        document.pwdForm.chkUseEnterToTogglePriceHistory.disabled = false;
        document.pwdForm.chkUseLastTradingDay.disabled = false;
        document.pwdForm.chkCollectDetail.disabled = false;

        document.pwdForm.txtStartDate.style.cursor = "auto";
        document.pwdForm.txtStartDate.disabled = false;

        document.pwdForm.txtEndDate.style.cursor = "auto";
        document.pwdForm.txtEndDate.disabled = false;

        document.pwdForm.btnWLSelect.style.cursor = "auto";
        document.pwdForm.btnWLSelect.disabled = false;
        document.pwdForm.btnWLReset.style.cursor = "auto";
        document.pwdForm.btnWLReset.disabled = false;
        document.pwdForm.btnSymSelect.style.cursor = "auto";
        document.pwdForm.btnSymSelect.disabled = false;
        document.pwdForm.btnSymFind.style.cursor = "auto";
        document.pwdForm.btnSymFind.disabled = false;


        document.getElementById("spanRunning").style.backgroundColor = "green";
        document.getElementById("spanRunning").style.Color = "white";
        document.getElementById("spanRunning").style.visibility = "hidden";

    }
}

function ShowProgress(bStart, bStop) {
    let elem = document.getElementById("myBar");
    if (giProgress >= 100) {
        elem.style.width = "100%";
    } else {
        elem.style.width = giProgress.toString() + "%";
    }
    if (bStart) {
        if (giProgressIntervalId != 0) {
            window.clearInterval(giProgressIntervalId);
        }
        giProgressIntervalId = window.setInterval("ShowProgress(false, false)", 50);
    } else if (bStop) {
        gbStopProgress = true;
        //if (giProgressIntervalId != 0) {
        //    window.clearInterval(giProgressIntervalId);
        //    giProgressIntervalId = 0;
        //}
        //elem.style.width = "0%";
    } else if (gbStopProgress) {
        if (giProgressIntervalId != 0) {
            window.clearInterval(giProgressIntervalId);
            giProgressIntervalId = 0;
        }
        gbStopProgress = false;
        elem.style.width = "0%";
    }
}

function SetSpecialPriceColor(dDiffShort, dDiffLong, dPrice) {
    //Stock Price	Min Move <= 5 Mins	Min Move <= 40 Mins
    //    < 5	0.50	0.65
    //5 - 10	0.75	1.00
    //10 - 20	1.10	1.45
    //20 - 40	1.40	1.80
    //40 - 60	1.50	1.95
    //80 - 100	1.90	2.45
    //    > 100	2.00	2.60
    let iReturn = 0; //0 = not special, 1 = short special, 2 = long special, 3 = short and long special
    if (dPrice < 5.01) {
        if ((dDiffShort > 0.49) && (dDiffLong > 0.64)) {
            iReturn = 3;
        } else if (dDiffShort > 0.49) {
            iReturn = 1;
        } else if (dDiffLong > 0.64) {
            iReturn = 2;
        }
    } else if (dPrice < 10.01) {
        if ((dDiffShort > 0.75) && (dDiffLong > 1.0)) {
            iReturn = 3;
        } else if (dDiffShort > 0.75) {
            iReturn = 1;
        } else if (dDiffLong > 1.0) {
            iReturn = 2;
        }
    } else if (dPrice < 20.01) {
        if ((dDiffShort > 1.1) && (dDiffLong > 1.45)) {
            iReturn = 3;
        } else if (dDiffShort > 1.1) {
            iReturn = 1;
        } else if (dDiffLong > 1.45) {
            iReturn = 2;
        }
    } else if (dPrice < 40.01) {
        if ((dDiffShort > 1.4) && (dDiffLong > 1.8)) {
            iReturn = 3;
        } else if (dDiffShort > 1.4) {
            iReturn = 1;
        } else if (dDiffLong > 1.8) {
            iReturn = 2;
        }
    } else if (dPrice < 60.01) {
        if ((dDiffShort > 1.5) && (dDiffLong > 1.95)) {
            iReturn = 3;
        } else if (dDiffShort > 1.5) {
            iReturn = 1;
        } else if (dDiffLong > 1.95) {
            iReturn = 2;
        }
    } else if (dPrice < 100.01) {
        if ((dDiffShort > 1.9) && (dDiffLong > 2.45)) {
            iReturn = 3;
        } else if (dDiffShort > 1.9) {
            iReturn = 1;
        } else if (dDiffLong > 2.45) {
            iReturn = 2;
        }
    } else {
        if ((dDiffShort > 2.0) && (dDiffLong > 2.6)) {
            iReturn = 3;
        } else if (dDiffShort > 2.0) {
            iReturn = 1;
        } else if (dDiffLong > 2.6) {
            iReturn = 2;
        }
    }
    return iReturn;
}

function SetupIndexes() {
    SetCurrentIndexes();
    //debugger
    if (gsMarketsLastIndexes != gsMarketsCurrentIndexes) {
        gsMarketsLastIndexes = gsMarketsCurrentIndexes;
        setCookie(gsMarketCookieName, SetCurrentCookie(), 30);
        let sMarketsToTrack = gsMarketsLastIndexes.split(",");
        gMarketIndexes.length = 0;
        if (sMarketsToTrack.length > 0) {
            let sRow1 = "<tr>";
            let sRow2 = "<tr>";
            let sRow3 = "<tr>";
            for (let idx = 0; idx < sMarketsToTrack.length; idx++) {
                let sMarket = sMarketsToTrack[idx].split("/");
                if (sMarket.length > 0) {
                    let marketIndex = new MarketIndex();
                    if (sMarket[0] == gsMarketsOilGas) {
                        marketIndex.symbol = gsMarketsOilGasActual;
                    } else {
                        marketIndex.symbol = sMarket[0].toUpperCase();
                    }
                    if (sMarket.length == 2) {
                        marketIndex.description = sMarket[1];
                    } else {
                        marketIndex.description = sMarket[0];
                    }
                    marketIndex.tdName = "tdMarket" + idx.toString();
                    gMarketIndexes[gMarketIndexes.length] = marketIndex;
                    sRow1 = sRow1 + "<td id=\"" + marketIndex.tdName + "\" style=\"color:black; vertical-align:top; text-align:center; width:" + gsMarketWidth + "px\"></td>";
                    sRow2 = sRow2 + "<td id=\"" + marketIndex.tdName + "Value\" style=\"color:black; vertical-align:top; text-align:center; width:" + gsMarketWidth + "px\"></td>";
                    sRow3 = sRow3 + "<td style=\"vertical-align:middle; text-align:center; width:" + gsMarketWidth + "px\" >" +
                        "<input style=\"padding-left:2px; padding-right:0px; padding-top:0px; padding-bottom:0px; border-width:0px; font-family:Arial, Helvetica, sans-serif; font-size:10pt; text-align:center; width:" + gsMarketWidthChange + "px; height:20px; visibility:visible\" type=\"button\" id=\"" + marketIndex.tdName + "Change\" name=\"" + marketIndex.tdName + "Change\" value=\"0\" onclick=\"DoChangeIndexChange()\">" +
                        "</td>";
                    //sRow3 = sRow3 + "<td style=\"vertical-align:middle; text-align:left; width:" + gsMarketWidth + "px\" >" +
                    //    "<input style=\"border-radius:5px; font-family:Arial, Helvetica, sans-serif; font-size:10pt;width:" + gsMarketWidthChange + "px; height:20px; visibility:visible\" type=\"button\" id=\"" + marketIndex.tdName + "Change\" name=\"" + marketIndex.tdName + "Change\" value=\"0\" onclick=\"DoChangeIndexChange()\">" +
                    //    "</td>";
                }
            }
            sRow1 = sRow1 + "</tr>"
            sRow2 = sRow2 + "</tr>"
            sRow3 = sRow3 + "</tr>"
            document.getElementById("tblIndexTable").style.width = (sMarketsToTrack.length * parseInt(gsMarketWidth)).toString() + "px";
            document.getElementById("tblIndexTable").innerHTML = sRow1 + sRow2 + sRow3;
        }
    }

}
function SetupWatchlists(bDoingSymbols) {

    if (gbUsingCell) {
        if (gWatchlists.length > 0) {
            let s = "<table id=\"tblWLSelected\" style=\"border-width:1px;\">";
            //        let s = "<table id=\"tblWLSelected\" style=\"width:500px;border-width:1px;\">";

            s = s + "<tr><td colspan=\"2\" style=\"color:black; height:20px; width:100%; text-align:left; vertical-align:top; border-width:0px; border-style:solid; border-spacing:1px; border-color:White\"><b>Watchlists</b></td></tr>";

            let sLastAccountname = "";
            for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                if (((gWatchlists[idxWL].name == gsAccountSavedOrders) && (!bDoingSymbols)) ||
                    ((gWatchlists[idxWL].name == gsAccountWLSummary) && (!bDoingSymbols)) ||
                    ((gWatchlists[idxWL].name != gsAccountSavedOrders) && (gWatchlists[idxWL].name != gsAccountWLSummary))) {
                    if (gWatchlists[idxWL].accountName != sLastAccountname) {
                        sLastAccountname = gWatchlists[idxWL].accountName;
                        s = s + "<tr>";
                        s = s + "<td colspan=\"2\" style=\"width:100%; text-align:left; vertical-align:top;border-width:0px;\">" + sLastAccountname + "</td>";
                        s = s + "</tr>";
                    }
                    s = s + "<tr>";
                    let bSelected = false;
                    if (bDoingSymbols) {
                        bSelected = gWatchlists[idxWL].bSelectedSymbols;
                    } else if (gWatchlists[idxWL].name == gsAccountSavedOrders) {
                        bSelected = gWatchlists[idxWL].bSelectedSO
                    } else {
                        bSelected = gWatchlists[idxWL].bSelected;
                    }
                    if (bSelected) {
                        s = s + "<td style=\"vertical-align:top;border-width:0px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "<input checked type=\"checkbox\" value=\"\" onclick=\"wlMarkSelected(" + idxWL.toString() + ")\">" +
                            "</td > ";
                    } else {
                        s = s + "<td style=\"vertical-align:top;border-width:0px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "<input type=\"checkbox\" value=\"\" onclick=\"wlMarkSelected(" + idxWL.toString() + ")\">" +
                            "</td > ";
                    }
                    //                s = s + "<td onclick=\"wlShowSymbols(" + idxWL.toString() + ")\" style=\"text-align:left;vertical-align:top;border-width:0px;\">" +
                    s = s + "<td \" style=\"text-align:left;vertical-align:top;border-width:0px;\">" +
                        gWatchlists[idxWL].name +
                        "</td>";
                    s = s + "</tr>";
                }
            }
            s = s + "<tr></tr>";
            s = s + "<tr>";
            s = s + "<td style=\"vertical-align:top;border-width:0px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<input style=\"border-radius:15px;\" type=\"button\" value=\"OK\" onclick=\"wlOKClicked()\">" +
                "</td > ";
            s = s + "<td style=\"vertical-align:top;border-width:0px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<input style=\"border-radius:15px;\" type=\"button\" value=\"Cancel\" onclick=\"wlCancelClicked()\">" +
                "</td > ";
            s = s + "</tr>";

            s = s + "</table>";
            document.getElementById("divWLSelect").innerHTML = s;
        }
    } else {
        if (gWatchlists.length > 0) {
            let s = "<select id=\"optWL\" size=\"20\" onclick=\"wlWatchlistSelected()\">";

            let sLastAccountname = "";
            for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                if (((gWatchlists[idxWL].name == gsAccountSavedOrders) && (!bDoingSymbols)) ||
                    ((gWatchlists[idxWL].name == gsAccountWLSummary) && (!bDoingSymbols)) ||
                    ((gWatchlists[idxWL].name != gsAccountSavedOrders) && (gWatchlists[idxWL].name != gsAccountWLSummary)) ) {
                    if (sLastAccountname == "") {
                        sLastAccountname = gWatchlists[idxWL].accountName;
                        s = s + "<option selected value=\"\">&nbsp;</option>";
                        s = s + "<optgroup label=\"" + sLastAccountname + "\">";
                    } else {
                        if (gWatchlists[idxWL].accountName != sLastAccountname) {
                            sLastAccountname = gWatchlists[idxWL].accountName;
                            s = s + "</optgroup>";
                            s = s + "<optgroup label=\"" + sLastAccountname + "\">";
                        }
                    }

                    s = s + "<option value=\"" + idxWL.toString() + "\">" + gWatchlists[idxWL].name + "</option>";
                }
            }
            s = s + "</optgroup>";
            s = s + "</select>";
            document.getElementById("spanWLSelectWatchlists").innerHTML = s;
        }
    }
}

function SetWait() {
    if (gbDoingStockPriceHistory) {
        document.body.style.cursor = "auto";

        document.pwdForm.txtSymbols.style.cursor = "auto";
        document.pwdForm.txtSymbols.disabled = false;

        document.pwdForm.btnGetTrades.style.cursor = "wait";
        document.pwdForm.btnGetTrades.disabled = true;

        document.pwdForm.btnGetStockPriceHistory.value = "Stop Price History";

        //document.pwdForm.btnGetStockPriceHistoryStart.style.cursor = "wait";
        //document.pwdForm.btnGetStockPriceHistoryStart.disabled = true;

        //document.pwdForm.btnGetStockPriceHistoryStop.style.cursor = "auto";
        //document.pwdForm.btnGetStockPriceHistoryStop.disabled = false;

        document.pwdForm.txtShortTime.style.cursor = "wait";
        document.pwdForm.txtShortTime.disabled = true;

        document.pwdForm.txtLongTime.style.cursor = "wait";
        document.pwdForm.txtLongTime.disabled = true;

        document.pwdForm.chkUseExtended.disabled = true;
        document.pwdForm.chkUseEnterToTogglePriceHistory.disabled = true;
        document.pwdForm.chkUseLastTradingDay.disabled = true;
        document.pwdForm.chkCollectDetail.disabled = true;

        document.pwdForm.txtStartDate.style.cursor = "wait";
        document.pwdForm.txtStartDate.disabled = true;

        document.pwdForm.txtEndDate.style.cursor = "wait";
        document.pwdForm.txtEndDate.disabled = true;

        document.pwdForm.btnWLSelect.style.cursor = "wait";
        document.pwdForm.btnWLSelect.disabled = true;
        document.pwdForm.btnWLReset.style.cursor = "wait";
        document.pwdForm.btnWLReset.disabled = true;
        document.pwdForm.btnSymSelect.style.cursor = "wait";
        document.pwdForm.btnSymSelect.disabled = true;
        document.pwdForm.btnSymFind.style.cursor = "wait";
        document.pwdForm.btnSymFind.disabled = true;

        document.getElementById("spanRunning").style.backgroundColor = "green";
        document.getElementById("spanRunning").style.Color = "white";
        document.getElementById("spanRunning").style.visibility = "visible";

    } else {
        document.body.style.cursor = "wait";
        document.pwdForm.txtSymbols.style.cursor = "wait";
        document.pwdForm.txtSymbols.disabled = true;

        if (!gbDoingGetTrades) {
            document.pwdForm.btnGetTrades.style.cursor = "wait";
            document.pwdForm.btnGetTrades.disabled = true;
        }

        document.pwdForm.btnGetStockPriceHistory.value = "Start Price History";
        document.pwdForm.btnGetStockPriceHistory.style.cursor = "wait";
        document.pwdForm.btnGetStockPriceHistory.disabled = true;

        //document.pwdForm.btnGetStockPriceHistoryStart.style.cursor = "wait";
        //document.pwdForm.btnGetStockPriceHistoryStart.disabled = true;

        //document.pwdForm.btnGetStockPriceHistoryStop.style.cursor = "wait";
        //document.pwdForm.btnGetStockPriceHistoryStop.disabled = true;

        document.pwdForm.txtShortTime.style.cursor = "wait";
        document.pwdForm.txtShortTime.disabled = true;

        document.pwdForm.txtLongTime.style.cursor = "wait";
        document.pwdForm.txtLongTime.disabled = true;

        document.pwdForm.chkUseExtended.disabled = true;
        document.pwdForm.chkUseEnterToTogglePriceHistory.disabled = true;
        document.pwdForm.chkUseLastTradingDay.disabled = true;
        document.pwdForm.chkCollectDetail.disabled = true;

        document.pwdForm.txtStartDate.style.cursor = "wait";
        document.pwdForm.txtStartDate.disabled = true;

        document.pwdForm.txtEndDate.style.cursor = "wait";
        document.pwdForm.txtEndDate.disabled = true;

        document.pwdForm.btnWLSelect.style.cursor = "wait";
        document.pwdForm.btnWLSelect.disabled = true;
        document.pwdForm.btnWLReset.style.cursor = "wait";
        document.pwdForm.btnWLReset.disabled = true;
        document.pwdForm.btnSymSelect.style.cursor = "wait";
        document.pwdForm.btnSymSelect.disabled = true;
        document.pwdForm.btnSymFind.style.cursor = "wait";
        document.pwdForm.btnSymFind.disabled = true;

        document.getElementById("spanRunning").style.backgroundColor = "green";
        document.getElementById("spanRunning").style.Color = "white";
        document.getElementById("spanRunning").style.visibility = "hidden";
    }
}

function showTDAPIError(sError) {
    document.getElementById("divTDAPIError").innerHTML = sError;
    if (document.getElementById("divTDAPIError").style.display == "none") {
        document.getElementById("divTDAPIError").style.display = "block";
        MoveDivs(true);
    }
    if (giAPIErrorTimeoutId != 0) {
        window.clearInterval(giAPIErrorTimeoutId);
    }
    giAPIErrorTimeoutId = window.setTimeout("hideTDAPIError()", 3000);

}

function sortByChgShortValue(a, b) {
    if ((a.shortPIP.high - a.shortPIP.low) < (b.shortPIP.high - b.shortPIP.low)) {
        return 1;
    }
    if ((a.shortPIP.high - a.shortPIP.low) > (b.shortPIP.high - b.shortPIP.low)) {
        return -1;
    }
    return 0;
}

function sortByDayGainPercent(a, b) {
    if (a.gainPercent < b.gainPercent) {
        return 1;
    }
    if (a.gainPercent > b.gainPercent) {
        return -1;
    }
    return 0;
}

function sortByHoldingGainPercent(a, b) {
    if (a.gainPercent < b.gainPercent) {
        return 1;
    }
    if (a.gainPercent > b.gainPercent) {
        return -1;
    }
    return 0;
}

function sortByPortfolioGain(a, b) {
    if (a.gain < b.gain) {
        return 1;
    }
    if (a.gain > b.gain) {
        return -1;
    }
    return 0;
}

function sortByRank(a, b) {
    if (a.rank < b.rank) {
        return -1;
    }
    if (a.rank > b.rank) {
        return 1;
    }
    return 0;
}



function sortBySymbol(a, b) {
    let aSymbol = a.symbol;
    let bSymbol = b.symbol;
    let sX = "                                                  ";

    if (aSymbol.length < 20) {
        aSymbol = aSymbol + sX.substr(0, 20 - aSymbol.length);
    }
    if (bSymbol.length < 20) {
        bSymbol = bSymbol + sX.substr(0, 20 - bSymbol.length);
    }
    if (aSymbol < bSymbol) {
        return -1;
    }
    if (aSymbol > bSymbol) {
        return 1;
    }
    return 0;
}

function sortBySymbolAndAccountname(a, b) {
    let aSymbol = a.symbol;
    let bSymbol = b.symbol;
    let aAccountName = a.accountName;
    let bAccountName = b.accountName;
    let sX = "                                                  ";

    if (aSymbol.length < 20) {
        aSymbol = aSymbol + sX.substr(0, 20 - aSymbol.length);
    }
    if (bSymbol.length < 20) {
        bSymbol = bSymbol + sX.substr(0, 20 - bSymbol.length);
    }
    if (aAccountName.length < 40) {
        aAccountName = aAccountName + sX.substr(0, 40 - aAccountName.length);
    }
    if (bAccountName.length < 40) {
        bAccountName = bAccountName + sX.substr(0, 40 - bAccountName.length);
    }
    if ((aSymbol + aAccountName) < (bSymbol + bAccountName)) {
        return -1;
    }
    if ((aSymbol + aAccountName) > (bSymbol + bAccountName)) {
        return 1;
    }
    return 0;
}

function sortByWLAccountandWLName(a, b) {
    let aName = a.name;
    let bName = b.name;
    let aAccountName = a.accountName;
    let bAccountName = b.accountName;
    let sX = "                                                  ";

    if (aName.length < 20) {
        aName = aName + sX.substr(0, 20 - aName.length);
    }
    if (bName.length < 20) {
        bName = bName + sX.substr(0, 20 - bName.length);
    }
    if (aAccountName.length < 40) {
        aAccountName = aAccountName + sX.substr(0, 40 - aAccountName.length);
    }
    if (bAccountName.length < 40) {
        bAccountName = bAccountName + sX.substr(0, 40 - bAccountName.length);
    }
    if ((aAccountName + aName) < (bAccountName + bName)) {
        return -1;
    }
    if ((aAccountName + aName) > (bAccountName + bName)) {
        return 1;
    }
    return 0;
}

function UseEnterToTogglePriceHistory(ev) {
    if (ev.srcElement.checked) {
        gbUseEnterToTogglePriceHistory = true;
    } else {
        gbUseEnterToTogglePriceHistory = false;
    }
}

function UseExtendedChanged(ev) {
    if (ev.srcElement.checked) {
        gbUseExtended = true;
    } else {
        gbUseExtended = false;
    }
}

function UseLastTradingDayChanged(ev) {
    //debugger
    if (ev.srcElement.checked) {
        gbUseLastTradingDay = true;
    } else {
        gbUseLastTradingDay = false;
    }
}

function ValidateTDDate(sStartDate) {
    let s = "";
    let vTmp;
    let bOk = false;

    try {
        vTmp = sStartDate.split("-")
        if (vTmp.length != 3) {
            alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
            return bOk;
        }
        else {
            if (vTmp[0].toString().length != 4) {
                alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
                return bOk;
            }

            if (vTmp[1].toString().length != 2) {
                alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
                return bOk;
            }

            if (vTmp[2].toString().length != 2) {
                alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
                return bOk;
            }

        }
        s = vTmp[1] + "/" + vTmp[2] + "/" + vTmp[0]; //changed 11/29/20 fro 2-1-0 to 1-2-0


        // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
            bOk = false;
        } else {
            // Parse the date parts to integers
            let parts = s.split("/");
            let day = parseInt(parts[1], 10);
            let month = parseInt(parts[0], 10);
            let year = parseInt(parts[2], 10);

            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                bOk = false;
            } else {
                let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Adjust for leap years
                if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                    monthLength[1] = 29;

                // Check the range of the day
                bOk = day > 0 && day <= monthLength[month - 1];
            }
        }
        if (!bOk) {
            alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
        }
    }
    catch (eDate) {
        alert("Invalid TD date. Please enter a date in the following format: yyyy-mm-dd");
        return bOk;
    }
    return bOk;
}


function window_onLoad() {
    PageLoad();
}

function wlAddDiv(sSpanId, sDiv) {
    giZIndex++;
    let x = document.createElement("SPAN");                     // Create a <span> element
    x.id = sSpanId;
    x.style.left = "800px";
    x.style.top = "40px";
    x.style.fontFamily = "Arial, Helvetica, sans-serif";
    x.style.fontSize = "10pt";
    x.style.position = "absolute";
    x.style.zIndex = giZIndex.toString();
    x.onclick = function () {
        giZIndex++;
        if ((document.getElementById(sSpanId) != null) && (!isUndefined(document.getElementById(sSpanId)))) {
            document.getElementById(sSpanId).style.zIndex = giZIndex.toString();
        }
    };
    x.innerHTML = sDiv;

    document.body.appendChild(x);
    wlSetupDragDiv(sSpanId);
}


function wlAskShowAllAccountsForEachSymbol() {
    gbWLShowAllAccountsForSymbol = false;
    //        gbWLShowAllAccountsForSymbol = confirm("Show all of the  accounts for each symbol?");
}

function wlCancelClicked() {
    document.getElementById("wlForm").style.display = "none";
    document.getElementById("pwdForm").style.display = "block";
    document.getElementById("MainForm").style.display = "block";
    wlShowAllWatchlists();

    for (let idx = 0; idx < gWatchlists.length; idx++) {
        if (gbDoingSymbolsSelect) {
            gWatchlists[idx].bSelectedSymbolsTemp = gWatchlists[idx].bSelectedSymbols;
        } else {
            gWatchlists[idx].bSelectedTemp = gWatchlists[idx].bSelected;
        }
    }
    gbDoingSymbolsSelect = false;
    SetupWatchlists(false);
}

function wlDoCancelPopup() {
    document.getElementById("optWL").value = "";
    wlWatchlistSelected();
}

function wlDoRemoveDiv(idxWL) {
    if (gWatchlists[idxWL].spanName != "") {
        wlRemoveDiv(gWatchlists[idxWL].spanName);
        gWatchlists[idxWL].spanName = "";
        gWatchlists[idxWL].bSelected = false;
        gWatchlists[idxWL].bSelectedTemp = false;
        gWatchlists[idxWL].bSelectedSO = false;
        gWatchlists[idxWL].bSelectedSOTemp = false;
        gWatchlists[idxWL].bSelectedWLSummary = false;
        gWatchlists[idxWL].bSelectedWLSummaryTemp = false;

        for (let idxItem = 0; idxItem < gWatchlists[idxWL].WLItems.length; idxItem++) {
            gWatchlists[idxWL].WLItems[idxItem].bSelectedForOrder = false;
        }

    }

}

function wlDoSetShowingSelectWatchlists() {
    gbShowingSelectWatchlists = true;
}

function wlHideAllWatchlists() {
    if (gWatchlists.length > 0) {
        for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
            if (gWatchlists[idxWL].spanName != "") {
                if (gWatchlists[idxWL].bSelected) {
                    document.getElementById(gWatchlists[idxWL].spanName).style.display = "none";
                }
            }
        }
    }
}

function wlMarkSelected(idxWL) {
    if (gbDoingSymbolsSelect) {
        gWatchlists[idxWL].bSelectedTempSymbols = !gWatchlists[idxWL].bSelectedTempSymbols;
    } else {
        if (gWatchlists[idxWL].name == gsAccountWLSummary) {
            gWatchlists[idxWL].bSelectedWLSummaryTemp = !gWatchlists[idxWL].bSelectedWLSummaryTemp;
        } else if (gWatchlists[idxWL].name == gsAccountSavedOrders) {
            gWatchlists[idxWL].bSelectedSOTemp = !gWatchlists[idxWL].bSelectedSOTemp;
        } else {
            gWatchlists[idxWL].bSelectedTemp = !gWatchlists[idxWL].bSelectedTemp;
        }
    }
}

function wlMarkSelectedItem(idxWL, idxWLItem) {
    if (idxWLItem == -1) {
        if (!gbDoingGetTDData) {
            if (giGetTDDataTimeoutId != 0) {
                window.clearTimeout(giGetTDDataTimeoutId);
                giGetTDDataTimeoutId = 0;
                let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;
                let bChecked = false;
                if (document.getElementById("chkWLItem" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + "000").checked) {
                    bChecked = true;
                }

                for (let idxItem = 0; idxItem < gWatchlists[idxWL].WLItems.length; idxItem++) {
                    gWatchlists[idxWL].WLItems[idxItem].bSelectedForOrder = bChecked;
                }
                giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 10);

            }
        } else {
            window.setTimeout("wlMarkSelectedItem(" + idxWL.toString() + "," + idxWLItem.toString() + ")", 100);
        }

    } else {
        if (!gbDoingGetTDData) {
            if (giGetTDDataTimeoutId != 0) {
                window.clearTimeout(giGetTDDataTimeoutId);
                giGetTDDataTimeoutId = 0;
                let sThisId = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;

                gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder = !gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder;
                let sThisTRId = "TR" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + FormatIntegerNumber(idxWLItem, 3, "0");
                if (gWatchlists[idxWL].WLItems[idxWLItem].bSelectedForOrder) {
                    //was set to checked

                    if ((!isUndefined(document.getElementById(sThisTRId))) && (document.getElementById(sThisTRId) != null)) {
                        document.getElementById(sThisTRId).style.backgroundColor = gsWLTableSelectedRowBackgroundColor;
                    }

                    // check to see if everything has been selected
                    let bAllChecked = true;
                    for (let idxItem = 0; idxItem < gWatchlists[idxWL].WLItems.length; idxItem++) {
                        if (gWatchlists[idxWL].WLItems[idxItem].bSelectedForOrder) {
                            bAllChecked = false;
                            break;
                        }
                    }
                    if (bAllChecked) {
                        document.getElementById("chkWLItem" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + "000").checked = true;
                    }

                } else {
                    //was set to unchecked
                    if ((!isUndefined(document.getElementById(sThisTRId))) && (document.getElementById(sThisTRId) != null)) {
                        if ((idxWLItem % 2) == 0) {
                            document.getElementById(sThisTRId).style.backgroundColor = gsWLTableEvenRowBackgroundColor;
                        } else {
                            document.getElementById(sThisTRId).style.backgroundColor = gsWLTableOddRowBackgroundColor;
                        }
                    }
                    //set the top checkbox to unchecked
                    document.getElementById("chkWLItem" + sThisId + FormatIntegerNumber(idxWL, 3, "0") + "000").checked = false;
                }

                giGetTDDataTimeoutId = window.setTimeout("GetTDData(false)", 10);

            }
        } else {
            window.setTimeout("wlMarkSelectedItem(" + idxWL.toString() + "," + idxWLItem.toString() + ")", 100);
        }
    }
}

function wlOKClicked() {
    if (!gbDoingSymbolsSelect) {
        wlAskShowAllAccountsForEachSymbol();
    }
    if (gbUsingCell) {
        document.getElementById("wlForm").style.display = "none";
        document.getElementById("pwdForm").style.display = "block";
        document.getElementById("MainForm").style.display = "block";
        for (let idx = 0; idx < gWatchlists.length; idx++) {
            if (gbDoingSymbolsSelect) {
                gWatchlists[idx].bSelectedSymbols = gWatchlists[idx].bSelectedTempSymbols;
            } else if (gWatchlists[idx].name == gsAccountWLSummary) {
                gWatchlists[idx].bSelectedWLSummary = gWatchlists[idx].bSelectedWLSummaryTemp;
                gWatchlists[idx].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                if (gWatchlists[idx].bSelectedWLSummary) {
                    if (gWatchlists[idx].spanName == "") {
                        gWatchlists[idx].spanName = gWatchlists[idx].watchlistId + gWatchlists[idx].accountId;
                        wlAddDiv(gWatchlists[idx].spanName, "");
                    }
                } else {
                    if (gWatchlists[idx].spanName != "") {
                        wlRemoveDiv(gWatchlists[idx].spanName);
                        gWatchlists[idx].spanName = "";
                    }
                }
            } else if (gWatchlists[idx].name == gsAccountSavedOrders) {
                gWatchlists[idx].bSelectedSO = gWatchlists[idx].bSelectedSOTemp;
                gWatchlists[idx].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                if (gWatchlists[idx].bSelectedSO) {
                    if (gWatchlists[idx].spanName == "") {
                        gWatchlists[idx].spanName = gWatchlists[idx].watchlistId + gWatchlists[idx].accountId;
                        wlAddDiv(gWatchlists[idx].spanName, "");
                    }
                } else {
                    if (gWatchlists[idx].spanName != "") {
                        wlRemoveDiv(gWatchlists[idx].spanName);
                        gWatchlists[idx].spanName = "";
                    }
                }

            } else {
                gWatchlists[idx].bSelected = gWatchlists[idx].bSelectedTemp;
                gWatchlists[idx].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                if (gWatchlists[idx].bSelected) {
                    if (gWatchlists[idx].spanName == "") {
                        gWatchlists[idx].spanName = gWatchlists[idx].watchlistId + gWatchlists[idx].accountId;
                        wlAddDiv(gWatchlists[idx].spanName, "");
                    }
                } else {
                    if (gWatchlists[idx].spanName != "") {
                        wlRemoveDiv(gWatchlists[idx].spanName);
                        gWatchlists[idx].spanName = "";
                    }
                }

            }
        }
        wlShowAllWatchlists();

        if (gbDoingSymbolsSelect) {
            let sSymbols = "";
            let sSep = "";
            for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
                if (gWatchlists[idxWL].bSelectedSymbols) {
                    for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
                        if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                            sSymbols = sSymbols + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                            sSep = ",";
                        }
                    }
                    gWatchlists[idxWL].bSelectedSymbols = false;
                    gWatchlists[idxWL].bSelectedTempSymbols = false;
                }
            }
            if (TrimLikeVB(document.getElementById("txtSymbols").value) != "") {
                if (sSymbols != "") {
                    sSymbols = TrimLikeVB(document.getElementById("txtSymbols").value) + "," + sSymbols;
                } else {
                    sSymbols = TrimLikeVB(document.getElementById("txtSymbols").value);
                }
            }
            sSymbols = GetUniqueListOfSymbols(sSymbols);
            document.getElementById("txtSymbols").value = sSymbols;

            gbDoingSymbolsSelect = false;
        } else {
            DoGetTDData();
        }

    } else {
        //should never get here because the button will not be displayed
    }


}

function wlRemoveDiv(sDivId) {
    try {
        let item = document.getElementById(sDivId);
        item.parentNode.removeChild(item);
    } catch (e) {

    }
}

function wlResetDragAllWatchlists() {
    if (gWatchlists.length > 0) {
        for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
            if (gWatchlists[idxWL].spanName != "") {
                if ((gWatchlists[idxWL].bSelected) || (gWatchlists[idxWL].bSelectedSO) || (gWatchlists[idxWL].bSelectedWLSummary)) {
                    if (!isUndefined(document.getElementById(gWatchlists[idxWL].spanName))) {
                        let x = document.getElementById(gWatchlists[idxWL].spanName);
                        let sSpanId = gWatchlists[idxWL].spanName;
                        wlSetupDragDiv(gWatchlists[idxWL].spanName);
                        x.onclick = function () {
                            giZIndex++;
                            if ((document.getElementById(sSpanId) != null) && (!isUndefined(document.getElementById(sSpanId)))) {
                                document.getElementById(sSpanId).style.zIndex = giZIndex.toString();
                            }
                        };
                    }
                }
            }
        }
    }
}

function wlSetupDragDiv(sSpanId) {
    if (gbUsingCell) {
        drag_div(sSpanId);
    } else {
        drag_divWL(sSpanId);
    }
}

function wlShowAllWatchlists() {
    if (gWatchlists.length > 0) {
        for (let idxWL = 0; idxWL < gWatchlists.length; idxWL++) {
            if (gWatchlists[idxWL].spanName != "") {
                if ((gWatchlists[idxWL].bSelected) || (gWatchlists[idxWL].bSelectedSO)) {
                    document.getElementById(gWatchlists[idxWL].spanName).style.display = "block";
                }
            }
        }
    }
}

function wlShowSymbols(idxWL) {
    //alert("selected index = " + idxWL.toString());
}

function wlWatchlistSelected() {

    let x = document.getElementById("optWL").value;
    let idxWL = -1;

    //alert("x = " + x + ", selectedIndex = " + document.getElementById("optWL").selectedIndex );

    if (x != "") {

        if (x != "") {
            idxWL = parseInt(x);
            if (!gbDoingSymbolsSelect) {
                wlAskShowAllAccountsForEachSymbol();
                if (gWatchlists[idxWL].name == gsAccountWLSummary) {
                    gWatchlists[idxWL].bSelectedWLSummary = true;
                    gWatchlists[idxWL].bSelectedWLSummaryTemp = true;
                    gWatchlists[idxWL].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                } else if (gWatchlists[idxWL].name == gsAccountSavedOrders) {
                    gWatchlists[idxWL].bSelectedSO = true;
                    gWatchlists[idxWL].bSelectedTempSO = true;
                    gWatchlists[idxWL].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                } else {
                    gWatchlists[idxWL].bSelected = true;
                    gWatchlists[idxWL].bSelectedTemp = true;
                    gWatchlists[idxWL].bShowAllAccountsForEachSymbol = gbWLShowAllAccountsForSymbol;
                }
                if (gWatchlists[idxWL].spanName == "") {
                    gWatchlists[idxWL].spanName = gWatchlists[idxWL].watchlistId + gWatchlists[idxWL].accountId;
                    wlAddDiv(gWatchlists[idxWL].spanName, "");
                }
            }
        }

        document.getElementById("optWL").value = "";
        document.getElementById("optWL").style.visibility = "hidden";
        document.getElementById("spanWLSelectWatchlists").style.top = "-1000px";
        document.getElementById("spanWLSelectWatchlists").style.left = "-1000px";
        if (gbDoingSymbolsSelect) {
            document.pwdForm.btnSymSelect.style.visibility = "visible";
            document.pwdForm.btnSymFind.style.visibility = "visible";
        } else {
            document.pwdForm.btnWLSelect.style.visibility = "visible";
        }
    } else {
        document.getElementById("optWL").value = "";
        document.getElementById("optWL").style.visibility = "hidden";
        document.getElementById("spanWLSelectWatchlists").style.top = "-1000px";
        document.getElementById("spanWLSelectWatchlists").style.left = "-1000px";

        if (gbDoingSymbolsSelect) {
            document.pwdForm.btnSymSelect.style.visibility = "visible";
            document.pwdForm.btnSymFind.style.visibility = "visible";
        } else {
            document.pwdForm.btnWLSelect.style.visibility = "visible";
        }
        gbDoingSymbolsSelect = false;
    }

    if ((gbDoingSymbolsSelect) && (idxWL != -1)) {
        let sSymbols = "";
        let sSep = "";
        for (let idxWLItem = 0; idxWLItem < gWatchlists[idxWL].WLItems.length; idxWLItem++) {
            if (gWatchlists[idxWL].WLItems[idxWLItem].bSelected) {
                sSymbols = sSymbols + sSep + gWatchlists[idxWL].WLItems[idxWLItem].symbol;
                sSep = ",";
            }
        }
        if (TrimLikeVB(document.getElementById("txtSymbols").value) != "") {
            if (sSymbols != "") {
                sSymbols = TrimLikeVB(document.getElementById("txtSymbols").value) + "," + sSymbols;
            } else {
                sSymbols = TrimLikeVB(document.getElementById("txtSymbols").value);
            }
        }
        sSymbols = GetUniqueListOfSymbols(sSymbols);
        document.getElementById("txtSymbols").value = sSymbols;

        gbDoingSymbolsSelect = false;
    } else {
        DoGetTDData();
    }
    gbShowingSelectWatchlists = false;
}
