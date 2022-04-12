//import React from 'react'
import { createPriceDropItem, updatePriceDropItem, deletePriceDropItem } from "../../graphql/mutations";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { useState, useEffect } from "react";
import { listPriceDropItems, listRestockItems } from "../../graphql/queries";
import { v4 as uuid } from "uuid";
import { Paper, IconButton } from "@material-ui/core";
import "./MainDashboard.css";

import InsertItemPopup from "../Popups/InsertItemPopup";
import ItemInfoPopup from "../Popups/ItemInfoPopup";
import ItemSearchResultPopup from "../Popups/ItemSearchResultPopup";
import WebScraper from "../WebScraper/WebScraper";
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
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCellsPriceDrop.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? <span className={classes.visuallyHidden}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeadPriceDrops.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableHeadBackInStock(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCellsBackInStock.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? <span className={classes.visuallyHidden}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeadBackInStock.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Price Drop Items
        </Typography>
      )}

      {numSelected > 0 ? (
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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

  // This initializes the blogs to an empty array.
  const [priceDropItems, setPriceDropItems] = useState([]);
  const [restockItems, setRestockItems] = useState([]);
  const [formData, setFormData] = useState({});

  const [notifications, setNotifications] = useState([]);

  const notifyPriceDrop = () => {
    toast("Price Drop Notification");
    notifications[notifications.length] = "Price Drop Notification";
    setNotifications(notifications);
    console.log(notifications);
  };
  const notifyBackInStock = () => {
    toast("Back In Stock Notification");
    notifications[notifications.length] = "Back In Stock Notification";
    setNotifications(notifications);
    console.log(notifications);
  };

  // This tells the app to run fetchPriceDropItems everytime MainDashboard.js is rendered
  // Problem: fetchPriceDropItems updates states which renders the page. This will result in infinite loop
  // Soln: Add a second parameter to indicate this should only happen once
  useEffect(() => {
    fetchPriceDropItems();
    fetchRestockItems();
  }, []);

  const fetchPriceDropItems = async () => {
    try {
      // Call the graphQL API to get all price drop items from DynamoDB
      const priceDropData = await API.graphql(graphqlOperation(listPriceDropItems));
      // Extract the items
      const priceDropList = priceDropData.data.listPriceDropItems.items;
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
      console.log("restock list", restockList);
      setRestockItems(restockList);
    } catch (error) {
      console.log("error on fetching price drop items", error);
    }
  };

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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("currentPrice");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClickPriceDrop = (event) => {
    if (event.target.checked) {
      const newSelecteds = priceDropItems.map((n) => n.itemName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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

  const handleSelectAllClickBackInStock = (event) => {
    if (event.target.checked) {
      const newSelecteds = restockItems.map((n) => n.itemName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRowsPriceDrop = rowsPerPage - Math.min(rowsPerPage, priceDropItems.length - page * rowsPerPage);
  const emptyRowsBackInStock = rowsPerPage - Math.min(rowsPerPage, restockItems.length - page * rowsPerPage);

  return (
    <div className="App">
      <button onClick={notifyPriceDrop}>Notify Price Drop!</button>
      <button onClick={notifyBackInStock}>Notify Back In Stock!</button>
      <input onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} placeholder="Store" value={formData.storeName} />
      <input onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} placeholder="Item name" value={formData.itemName} />
      <input onChange={(e) => setFormData({ ...formData, initialPrice: e.target.value })} placeholder="Start price" value={formData.initialPrice} />
      <input onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })} placeholder="Current Price" value={formData.currentPrice} />
      <button onClick={createPDItem}> Create Item</button>
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
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <button className="add_item" onClick={() => setinsertItemPopup(true)} id="price-drop-table">
              Add item
            </button>

            <Table className={classes.table} aria-labelledby="tableTitle" size={dense ? "small" : "medium"} aria-label="enhanced table">
              <EnhancedTableHeadPriceDrops
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClickPriceDrop}
                onRequestSort={handleRequestSort}
                rowCount={priceDropItems.length}
              />
              <TableBody>
                {stableSort(priceDropItems, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover onClick={(event) => handleClick(event, row.name)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected}>
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
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsPriceDrop }}>
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
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
      </div>

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <button className="add_item" onClick={() => setinsertItemPopup(true)} id="restock-table">
              Add item
            </button>
            <Table className={classes.table} aria-labelledby="tableTitle" size={dense ? "small" : "medium"} aria-label="enhanced table">
              <EnhancedTableHeadBackInStock
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClickBackInStock}
                onRequestSort={handleRequestSort}
                rowCount={restockItems.length}
              />
              <TableBody>
                {stableSort(restockItems, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover onClick={(event) => handleClick(event, row.name)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected}>
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
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsBackInStock }}>
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
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
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
      <ItemInfoPopup triggerInfoPopup={itemInfoPopup} setTriggeritemInfo={setItemInfoPopup} itemInfo={itemInfo}></ItemInfoPopup>
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
