//import React from 'react'
import { createPriceDropItem, updatePriceDropItem, deletePriceDropItem } from "../../graphql/mutations";
import { createRestockItem, updateRestockItem, deleteRestockItem } from "../../graphql/mutations";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { useState, useEffect } from "react";
import { listPriceDropItems, listRestockItems } from "../../graphql/queries";
import { v4 as uuid } from "uuid";
import { Paper, IconButton } from "@material-ui/core";
import "./MainDashboard.css";

import InsertItemPopup from "../Popups/InsertItemPopup";
import ItemInfoPopup from "../Popups/ItemInfoPopup";
import ItemSearchResultPopup from "../Popups/ItemSearchResultPopup";
import WebScraper from "../Webscraper/WebScraper";
import { defaultScraperData } from "../Popups/ScraperData";

import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";

import { Auth } from "aws-amplify";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormState = { storeName: "", itemName: "", initialPrice: "", currentPrice: "" };

toast.configure();

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCellsPriceDrop = [
  { id: "itemName", numeric: false, disablePadding: true, label: "Item Name" },
  { id: "storeName", numeric: false, disablePadding: false, label: "Store Name" },
  { id: "initialPrice", numeric: true, disablePadding: false, label: "Initial Price" },
  { id: "currentPrice", numeric: true, disablePadding: false, label: "Current Price" },
];

const headCellsBackInStock = [
  { id: "itemName", numeric: false, disablePadding: true, label: "Item Name" },
  { id: "storeName", numeric: false, disablePadding: false, label: "Store Name" },
  { id: "inStock", numeric: false, disablePadding: false, label: "In Stock" },
];

function EnhancedTableHeadPriceDrops(props) {
  const { classesPriceDrop, onSelectAllClickPriceDrop, orderPriceDrop, orderByPriceDrop, numSelectedPriceDrop, rowCountPriceDrop, onRequestSortPriceDrop } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSortPriceDrop(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelectedPriceDrop > 0 && numSelectedPriceDrop < rowCountPriceDrop}
            checked={rowCountPriceDrop > 0 && numSelectedPriceDrop === rowCountPriceDrop}
            onChange={onSelectAllClickPriceDrop}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCellsPriceDrop.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderByPriceDrop === headCell.id ? orderPriceDrop : false}
          >
            <TableSortLabel active={orderByPriceDrop === headCell.id} direction={orderByPriceDrop === headCell.id ? orderPriceDrop : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderByPriceDrop === headCell.id ? <span className={classesPriceDrop.visuallyHidden}>{orderPriceDrop === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeadPriceDrops.propTypes = {
  classesPriceDrop: PropTypes.object.isRequired,
  numSelectedPriceDrop: PropTypes.number.isRequired,
  onRequestSortPriceDrop: PropTypes.func.isRequired,
  onSelectAllClickPriceDrop: PropTypes.func.isRequired,
  orderPriceDrop: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderByPriceDrop: PropTypes.string.isRequired,
  rowCountPriceDrop: PropTypes.number.isRequired,
};

function EnhancedTableHeadBackInStock(props) {
  const { classesBackInStock, onSelectAllClickBackInStock, orderBackInStock, orderByBackInStock, numSelectedBackInStock, rowCountBackInStock, onRequestSortBackInStock } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSortBackInStock(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelectedBackInStock > 0 && numSelectedBackInStock < rowCountBackInStock}
            checked={rowCountBackInStock > 0 && numSelectedBackInStock === rowCountBackInStock}
            onChange={onSelectAllClickBackInStock}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCellsBackInStock.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderByBackInStock === headCell.id ? orderBackInStock : false}
          >
            <TableSortLabel active={orderByBackInStock === headCell.id} direction={orderByBackInStock === headCell.id ? orderBackInStock : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderByBackInStock === headCell.id ? <span className={classesBackInStock.visuallyHidden}>{orderBackInStock === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeadBackInStock.propTypes = {
  classesBackInStock: PropTypes.object.isRequired,
  numSelectedBackInStock: PropTypes.number.isRequired,
  onRequestSortBackInStock: PropTypes.func.isRequired,
  onSelectAllClickBackInStock: PropTypes.func.isRequired,
  orderBackInStock: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderByBackInStock: PropTypes.string.isRequired,
  rowCountBackInStock: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbarPriceDrop = (props) => {
  const classesPriceDrop = useToolbarStyles();
  const { numSelectedPriceDrop } = props;

  return (
    <Toolbar
      className={clsx(classesPriceDrop.root, {
        [classesPriceDrop.highlight]: numSelectedPriceDrop > 0,
      })}
    >
      {numSelectedPriceDrop > 0 ? (
        <Typography className={classesPriceDrop.title} color="inherit" variant="subtitle1" component="div">
          {numSelectedPriceDrop} selected
        </Typography>
      ) : (
        <Typography className={classesPriceDrop.title} variant="h6" id="tableTitle" component="div">
          Price Drop Items
        </Typography>
      )}

      {numSelectedPriceDrop > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbarPriceDrop.propTypes = {
  numSelectedPriceDrop: PropTypes.number.isRequired,
};

const EnhancedTableToolbarBackInStock = (props) => {
  const classesBackInStock = useToolbarStyles();
  const { numSelectedBackInStock } = props;

  return (
    <Toolbar
      className={clsx(classesBackInStock.root, {
        [classesBackInStock.highlight]: numSelectedBackInStock > 0,
      })}
    >
      {numSelectedBackInStock > 0 ? (
        <Typography className={classesBackInStock.title} color="inherit" variant="subtitle1" component="div">
          {numSelectedBackInStock} selected
        </Typography>
      ) : (
        <Typography className={classesBackInStock.title} variant="h6" id="tableTitle" component="div">
          Back In Stock Items
        </Typography>
      )}

      {numSelectedBackInStock > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbarBackInStock.propTypes = {
  numSelectedBackInStock: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function MainDashboard() {
  //////////////////////////////////////////////////////
  //const [sentNotifications, setSentNotifications] = useState(false);
  // This initializes the blogs to an empty array.
  const [priceDropItems, setPriceDropItems] = useState([]);
  const [restockItems, setRestockItems] = useState([]);
  const [formData, setFormData] = useState({});

  const [notifications, setNotifications] = useState([]);

  const notifyPriceDrop = (prevPrice, newPrice, itemName) => {
    toast("Price Dropped for " + itemName + " from $" + prevPrice + " to $" + newPrice);
    notifications[notifications.length] = "Price Dropped for " + itemName + " from " + prevPrice + " to " + newPrice;
    setNotifications(notifications);
    console.log(notifications);
  };
  const notifyBackInStock = (itemName) => {
    toast("Item " + itemName + " is back instock");
    notifications[notifications.length] = "Item " + itemName + " is back instock";
    setNotifications(notifications);
    console.log(notifications);
  };

  // This tells the app to run fetchPriceDropItems everytime MainDashboard.js is rendered
  // Problem: fetchPriceDropItems updates states which renders the page. This will result in infinite loop
  // Soln: Add a second parameter to indicate this should only happen once
  useEffect(() => {
    checkLoggedIn();
    fetchPriceDropItems();
    fetchRestockItems();
  }, []);
  const checkLoggedIn = async () => {
    // If the user is authenticated get a sign-out btn. 
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      document.getElementById("loginBtn").style.visibility = "hidden";
      document.getElementById("signoutBtn").style.visibility = "visible";
    })
    .catch(err => {console.log(err)});
  }

  setInterval(function () {
    // your code goes here...
    //console.log("Printing......");
    fetchPriceDropItems();
    fetchRestockItems();
  }, 60 * 1000);

  const fetchPriceDropItems = async () => {
    console.log("checking for price drops");
    try {
      // Call the graphQL API to get all price drop items from DynamoDB
      const priceDropData = await API.graphql(graphqlOperation(listPriceDropItems));
      // Extract the items
      const priceDropList = priceDropData.data.listPriceDropItems.items;

      //loop through priceDropList and run scraper
      let scraper = new WebScraper();
      for (let i = 0; i < priceDropList.length; i++) {
        let item_url = priceDropList[i].itemURL;
        scraper.getInfoFromURL(item_url).then(async (info) => {
          //insert webscraper run here on priceDropList[i].itemURL
          let current_price = priceDropList[i].currentPrice;
          current_price = current_price.replace("$", "");
          current_price = parseFloat(current_price);
          let initial_price = priceDropList[i].initialPrice;
          let id_i = priceDropList[i].id;
          let store_name = priceDropList[i].storeName;
          let item_name = priceDropList[i].itemName;
          if (current_price > info.price.amount) {
            console.log("New price is cheaper... BUY NOW", current_price);

            notifyPriceDrop(current_price, info.price.amount, item_name);
            // console.log("Sent Notification");

            let new_price = info.price.amount;
            const updatePDItem = {
              id: id_i,
              storeName: store_name,
              itemName: item_name,
              currentPrice: new_price,
              initialPrice: initial_price,
            };

            await API.graphql(graphqlOperation(updatePriceDropItem, { input: updatePDItem }));
          } else {
            console.log("price has not dropped", current_price);
          }
        });
      }
      //storing itemURL in array
      // let urlList = priceDropList.map(({currentPrice }) =>  currentPrice)
      // setUrlPricedropList(urlList)

      console.log("price drop item list", priceDropList);
      // Update the priceDropList object
      setPriceDropItems(priceDropList);
    } catch (error) {
      console.log("error on fetching price drop items", error);
    }
  };

  const fetchRestockItems = async () => {
    try {
      const restockData = await API.graphql(graphqlOperation(listRestockItems));
      const restockList = restockData.data.listRestockItems.items;

      //update stock
      let scraper = new WebScraper();
      for (let a = 0; a < restockList.length; a++) {
        let item_url_restock = restockList[a].itemURL;
        scraper.getInfoFromURL(item_url_restock).then(async (info) => {
          //insert webscraper run here on restockList[i].itemURL
          let in_stock = restockList[a].inStock;
          let id_restock = restockList[a].id;
          let store_name_restock = restockList[a].storeName;
          let item_name_restock = restockList[a].itemName;
          //if current stock is false but webscraper result is true then update table
          if (in_stock == "No") {
            if (info.stock) {
              notifyBackInStock(item_name_restock);
              console.log("Item is in stock");
              const updateRItem = {
                id: id_restock,
                storeName: store_name_restock,
                itemName: item_name_restock,
                inStock: "Yes",
              };

              await API.graphql(graphqlOperation(updateRestockItem, { input: updateRItem }));
            } else {
              console.log(item_name_restock + "Not back in stock!");
            }
          }
        });
      }

      console.log("restock item list", restockList);

      setRestockItems(restockList);
    } catch (error) {
      console.log("error on fetching price drop items", error);
    }
  };
  // const fetchPriceDropItems = async () => {
  //   try {
  //     Auth.currentAuthenticatedUser().then(console.log);
  //     // Call the graphQL API to get all price drop items from DynamoDB
  //     const priceDropData = await API.graphql(graphqlOperation(listPriceDropItems));
  //     // Extract the items
  //     const priceDropList = priceDropData.data.listPriceDropItems.items;
  //     console.log("price drop item list", priceDropList);
  //     // Update the priceDropList object
  //     setPriceDropItems(priceDropList);
  //   } catch (error) {
  //     console.log("error on fetching price drop items", error);
  //   }
  // };

  // const fetchRestockItems = async () => {
  //   try {
  //     const restockData = await API.graphql(graphqlOperation(listRestockItems));
  //     const restockList = restockData.data.listRestockItems.items;
  //     console.log("restock list", restockList);
  //     setRestockItems(restockList);
  //   } catch (error) {
  //     console.log("error on fetching price drop items", error);
  //   }
  // };

  const createPDItem = async () => {
    console.log("formData", formData);
    const { storeName, itemName, initialPrice, currentPrice } = formData;
    const createNewPDItem = {
      id: uuid(),
      username: "454359e3-344a-43b8-9153-a58f3cbd6c98",
      itemURL: "www.amazon.ca",
      storeName,
      itemName,
      initialPrice,
      currentPrice,
    };
    //need to upload to dynamoDB, graphqlOperations takes query and variable
    await API.graphql(graphqlOperation(createPriceDropItem, { input: createNewPDItem }));

    // if(!formData.storee || !formData.iteme || !formData.currentPricee || !formData.initialPricee)
    // return;
    // const priceDropData = await API.graphql(graphqlOperation(createPriceDropItem, {input: formData}));

    // await API.graphql({ query: createPriceDropItem, variables: { input : formData}});
    // setPriceDropItems([...priceDropItems, formData]);
    // setFormData(initialFormState);
  };

  // async function deletePDItem({id}){
  //     const newPDItemArray = priceDropItemData.filter(note => note.id !== id);
  //     setPriceDropItemData(newPDItemArray);
  //     await API.graphql({ query: deletePriceDropItem, variables: { input: {id}}});
  // };

  const classes = useStyles();
  const [orderPriceDrop, setOrderPriceDrop] = useState("asc");
  const [orderBackInStock, setOrderBackInStock] = useState("asc");
  const [orderByPriceDrop, setOrderByPriceDrop] = useState("currentPrice");
  const [orderByBackInStock, setOrderByBackInStock] = useState("itemName");
  const [selectedPriceDrop, setSelectedPriceDrop] = useState([]);
  const [selectedBackInStock, setSelectedBackInStock] = useState([]);
  const [pagePriceDrop, setPagePriceDrop] = useState(0);
  const [pageBackInStock, setPageBackInStock] = useState(0);
  const [densePriceDrop, setDensePriceDrop] = useState(false);
  const [denseBackInStock, setDenseBackInStock] = useState(false);
  const [rowsPerPagePriceDrop, setRowsPerPagePriceDrop] = useState(5);
  const [rowsPerPageBackInStock, setRowsPerPageBackInStock] = useState(5);

  const handleRequestSortPriceDrop = (event, property) => {
    const isAsc = orderByPriceDrop === property && orderPriceDrop === "asc";
    setOrderPriceDrop(isAsc ? "desc" : "asc");
    setOrderByPriceDrop(property);
  };

  const handleRequestSortBackInStock = (event, property) => {
    const isAsc = orderByBackInStock === property && orderBackInStock === "asc";
    setOrderBackInStock(isAsc ? "desc" : "asc");
    setOrderByBackInStock(property);
  };

  const handleSelectAllClickPriceDrop = (event) => {
    if (event.target.checked) {
      const newSelected = priceDropItems.map((n) => n.itemName);
      setSelectedPriceDrop(newSelected);
      return;
    }
    setSelectedPriceDrop([]);
  };

  const handleSelectAllClickBackInStock = (event) => {
    if (event.target.checked) {
      const newSelected = restockItems.map((n) => n.itemName);
      setSelectedBackInStock(newSelected);
      return;
    }
    setSelectedBackInStock([]);
  };
  //need to upload to dynamoDB, graphqlOperations takes query and variable

  // if(!formData.storee || !formData.iteme || !formData.currentPricee || !formData.initialPricee)
  // return;
  // const priceDropData = await API.graphql(graphqlOperation(createPriceDropItem, {input: formData}));

  // await API.graphql({ query: createPriceDropItem, variables: { input : formData}});
  // setPriceDropItems([...priceDropItems, formData]);
  // setFormData(initialFormState);

  // async function deletePDItem({id}){
  //     const newPDItemArray = priceDropItemData.filter(note => note.id !== id);
  //     setPriceDropItemData(newPDItemArray);
  //     await API.graphql({ query: deletePriceDropItem, variables: { input: {id}}});
  // };

  //state variables for item selection and info popups
  const [insertItemPopup, setinsertItemPopup] = useState(false);
  const [itemInfoPopup, setItemInfoPopup] = useState(false);
  const [itemSearchResultPopup, setItemSearchResultPopup] = useState(false);

  //state variable for the item URL of the item to be added
  const [itemURL, setItemURL] = useState("");

  //state variable for the search string + ecommerce website
  const [searchValue, setSearchValue] = useState({
    searchString: "",
    enteredEcommerceSite: "",
  });

  //state variable indicating which table to add the item from popup (either pricedrop or restock)
  const [isPriceDrop, setPriceDrop] = useState(false);

  const setTableType = (isPriceDropTable) => {
    setinsertItemPopup(true);
    setPriceDrop(isPriceDropTable);
  };

  //state variable containing list of item search results
  const [searchResults, setSearchResults] = useState(defaultScraperData);

  //default Item Info displayed (displayed while actual info is loading HTTP result)
  const defaultItemInfo = {
    name: "Loading...",
    price: {},
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831",
    site: "",
    stock: false,
    productID: "",
    options: {},
    URL: "",
  };

  //state variable for item info to be displaye in item info popup
  const [itemInfo, setItemInfo] = useState(defaultItemInfo);

  //everytime a URL is entered, get the corresponding item info and update state
  useEffect(() => {
    let scraper = new WebScraper();
    scraper.getInfoFromURL(itemURL).then((info) => {
      setItemInfo({
        name: info.name,
        price: info.price,
        imageURL: info.imageURL,
        site: info.site,
        stock: info.stock,
        productID: info.productID,
        options: info.options,
        URL: info.URL,
      });
    });
  }, [itemURL]);

  //every time a search is made (search values change), update the search results state
  useEffect(() => {
    let scraper = new WebScraper();
    scraper.getItemsFromSearch(searchValue.searchString, searchValue.enteredEcommerceSite).then((info) => {
      setSearchResults(info);
    });
  }, [searchValue]);

  const handleClickPriceDrop = (event, name) => {
    const selectedIndex = selectedPriceDrop.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPriceDrop, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedPriceDrop.slice(1));
    } else if (selectedIndex === selectedPriceDrop.length - 1) {
      newSelected = newSelected.concat(selectedPriceDrop.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedPriceDrop.slice(0, selectedIndex), selectedPriceDrop.slice(selectedIndex + 1));
    }

    setSelectedPriceDrop(newSelected);
  };

  const handleClickBackInStock = (event, name) => {
    const selectedIndex = selectedBackInStock.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBackInStock, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBackInStock.slice(1));
    } else if (selectedIndex === selectedBackInStock.length - 1) {
      newSelected = newSelected.concat(selectedBackInStock.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedBackInStock.slice(0, selectedIndex), selectedBackInStock.slice(selectedIndex + 1));
    }

    setSelectedBackInStock(newSelected);
  };

  const handleChangePagePriceDrop = (event, newPage) => {
    setPagePriceDrop(newPage);
  };

  const handleChangePageBackInStock = (event, newPage) => {
    setPageBackInStock(newPage);
  };

  const handleChangeRowsPerPagePriceDrop = (event) => {
    setRowsPerPagePriceDrop(parseInt(event.target.value, 10));
    setPagePriceDrop(0);
  };

  const handleChangeRowsPerPageBackInStock = (event) => {
    setRowsPerPageBackInStock(parseInt(event.target.value, 10));
    setPageBackInStock(0);
  };

  const handleChangeDensePriceDrop = (event) => {
    setDensePriceDrop(event.target.checked);
  };

  const handleChangeDenseBackInStock = (event) => {
    setDenseBackInStock(event.target.checked);
  };

  const isSelectedPriceDrop = (name) => selectedPriceDrop.indexOf(name) !== -1;

  const isSelectedBackInStock = (name) => selectedBackInStock.indexOf(name) !== -1;

  const emptyRowsPriceDrop = rowsPerPagePriceDrop - Math.min(rowsPerPagePriceDrop, priceDropItems.length - pagePriceDrop * rowsPerPagePriceDrop);
  const emptyRowsBackInStock = rowsPerPageBackInStock - Math.min(rowsPerPageBackInStock, restockItems.length - pageBackInStock * rowsPerPageBackInStock);

  return (
    <div className="App">
      {/* <button onClick={() => notifyPriceDrop(10, 9,"item name test")}>Notify Price Drop!</button>
      <button onClick={() => notifyBackInStock("back instock item test")}>Notify Back In Stock!</button> */}
      {/* <input onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} placeholder="Store" value={formData.storeName} />
      <input onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} placeholder="Item name" value={formData.itemName} />
      <input onChange={(e) => setFormData({ ...formData, initialPrice: e.target.value })} placeholder="Start price" value={formData.initialPrice} />
      <input onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} placeholder="Current Price" value={formData.currentPrice} />
      <button onClick={createPDItem}> Create Item</button> */}
      {/* <div style={{marginBottom:30}}>
            {  
            priceDropItemData.map(note => (
                <div key={note.id}>
                    <h2>{note.iteme}</h2>
                    <p>{note.storee}</p>
                    <h5>{note.currentPricee}</h5>
                    <h5>{note.initialPricee}</h5>
                    <button onClick={() => deletePDItem(note)}> Delete Item</button>
                    </div>
            ))
            
            }
          

            </div> */}
      {/* <table>
               <thead>
                   <tr>
                    <th> id</th>
                    <th>store</th>
                    <th>Item</th>
                    <th>initial price</th>
                    <th>current price</th>
                       </tr>
                   </thead> 


                   <tr>

                   </tr>
                
            </table>    */}

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbarPriceDrop numSelectedPriceDrop={selectedPriceDrop.length} />
          <TableContainer>
            <button className="add_item" onClick={() => setTableType(true)}>
              Add Item
            </button>

            <Table className={classes.table} aria-labelledby="tableTitle" size={densePriceDrop ? "small" : "medium"} aria-label="enhanced table">
              <EnhancedTableHeadPriceDrops
                classes={classes}
                numSelectedPriceDrop={selectedPriceDrop.length}
                order={orderPriceDrop}
                orderBy={orderByPriceDrop}
                onSelectAllClick={handleSelectAllClickPriceDrop}
                onRequestSort={handleRequestSortPriceDrop}
                rowCount={priceDropItems.length}
              />
              <TableBody>
                {stableSort(priceDropItems, getComparator(orderPriceDrop, orderByPriceDrop))
                  .slice(pagePriceDrop * rowsPerPagePriceDrop, pagePriceDrop * rowsPerPagePriceDrop + rowsPerPagePriceDrop)
                  .map((row, index) => {
                    const isItemSelected = isSelectedPriceDrop(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover onClick={(event) => handleClickPriceDrop(event, row.name)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.itemName}
                        </TableCell>
                        {/* <TableCell align="right">{row.itemName}</TableCell> */}
                        <TableCell align="right">{row.storeName}</TableCell>
                        <TableCell align="right">{row.initialPrice}</TableCell>
                        <TableCell align="right">{row.currentPrice}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRowsPriceDrop > 0 && (
                  <TableRow style={{ height: (densePriceDrop ? 33 : 53) * emptyRowsPriceDrop }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={priceDropItems.length}
            rowsPerPage={rowsPerPagePriceDrop}
            page={pagePriceDrop}
            onPageChange={handleChangePagePriceDrop}
            onRowsPerPageChange={handleChangeRowsPerPagePriceDrop}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={densePriceDrop} onChange={handleChangeDensePriceDrop} />} label="Dense padding" />
      </div>

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbarBackInStock numSelectedBackInStock={selectedBackInStock.length} />
          <TableContainer>
            <button className="add_item" onClick={() => setTableType(false)}>
              Add Item
            </button>
            <Table className={classes.table} aria-labelledby="tableTitle" size={denseBackInStock ? "small" : "medium"} aria-label="enhanced table">
              <EnhancedTableHeadBackInStock
                classes={classes}
                numSelected={selectedBackInStock.length}
                order={orderBackInStock}
                orderBy={orderByBackInStock}
                onSelectAllClick={handleSelectAllClickBackInStock}
                onRequestSort={handleRequestSortBackInStock}
                rowCount={restockItems.length}
              />
              <TableBody>
                {stableSort(restockItems, getComparator(orderBackInStock, orderByBackInStock))
                  .slice(pageBackInStock * rowsPerPageBackInStock, pageBackInStock * rowsPerPageBackInStock + rowsPerPageBackInStock)
                  .map((row, index) => {
                    const isItemSelected = isSelectedBackInStock(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover onClick={(event) => handleClickBackInStock(event, row.name)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.itemName}
                        </TableCell>
                        {/* <TableCell align="right">{row.itemName}</TableCell> */}
                        <TableCell align="right">{row.storeName}</TableCell>
                        <TableCell align="right">{row.inStock}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRowsBackInStock > 0 && (
                  <TableRow style={{ height: (denseBackInStock ? 33 : 53) * emptyRowsBackInStock }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={restockItems.length}
            rowsPerPage={rowsPerPageBackInStock}
            page={pageBackInStock}
            onPageChange={handleChangePageBackInStock}
            onRowsPerPageChange={handleChangeRowsPerPageBackInStock}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={denseBackInStock} onChange={handleChangeDenseBackInStock} />} label="Dense padding" />
      </div>
      {/* Item Selection and Info Popups */}
      <InsertItemPopup
        triggerInsertItem={insertItemPopup}
        setTriggerInsertItem={setinsertItemPopup}
        setTriggerItemInfo={setItemInfoPopup}
        setTriggerItemSearchResult={setItemSearchResultPopup}
        setTriggerItemURL={setItemURL}
        setTriggerSearchValues={setSearchValue}
      ></InsertItemPopup>
      <ItemInfoPopup triggerInfoPopup={itemInfoPopup} setTriggeritemInfo={setItemInfoPopup} itemInfo={itemInfo} priceDropTable={isPriceDrop}></ItemInfoPopup>
      <ItemSearchResultPopup
        triggerItemSearchResult={itemSearchResultPopup}
        setTriggerItemSearchResult={setItemSearchResultPopup}
        setTriggerItemInfo={setItemInfoPopup}
        setTriggerItemURL={setItemURL}
        searchResults={searchResults}
      ></ItemSearchResultPopup>

      {/* <ItemSearchResultPopup triggerInfoPopup={itemInfoPopup} setTriggeritemInfo={setItemInfoPopup}></ItemSearchResultPopup> */}
    </div>
  );
}

export default MainDashboard;
