import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core';
import { NavBar, Main, NotFound, Cart, Loading } from './components';
import { useState, useEffect, createRef, useRef } from 'react';
import { query, where, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import db, { AuthContextProvider } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Signin from './components/pages/Authentication/Signin';
import Signup from './components/pages/Authentication/Signup';

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar,
}));

const theme = createTheme({
  typography: {
    fontFamily: [
      "Montserrat", 
      "sans-serif"
    ].join(',')
  },
  palette: {
    primary: {
      light: '#50D2D8',
      main: '#29B3B9',
      dark: '#1F878C',
      contrastText: '#fff',
    },
    secondary: {
      light: '#D85650',
      main: '#B93029',
      dark: '#8C241F',
      contrastText: '#fff',
    },
  }
})

function App() {
  const classes = useStyles();
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(true)
  const [alertProps, setAlertProps] = useState({})
  const [cartAlertProps, setCartAlertProps] = useState({})
  const [userInfo, setUserInfo] = useState({isLoggedIn: false})
  const [state, setState] = useState("loading");
  const loadingRef = useRef()
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    setState(Boolean(user) ? "loggedin" : "redirect")
    setUserInfo(user)
  });

  // Authentication
  const AuthenticatedRoute = ({ component: C, ...props }) => {
    return (
      <Route 
        {...props}
        render={routeProps =>
          (state === "loggedin") ? <C {...routeProps} /> : ((state !== "loading") && <Redirect to="/authenticate" /> )}
      />
    )
  }

  const UnauthenticatedRoute = ({ component: C, ...props }) => {
    return (
      <Route
        {...props}
        render={routeProps =>
          !(state === "loggedin") ? <C {...routeProps} /> : ((state !== "loading") && <Redirect to="/" /> )
        }
      />
    )
  }

  // Snackbar Alert handlers
  const handleClose = () => {
      setAlertProps({ open: false });
      setCartAlertProps({ open: false });
  };

  // Products
  const getProducts = async () => {
    const productsCol = collection(db, "products")
    const productsSnapshot = await getDocs(productsCol)
    
    if (!productsSnapshot.empty) {
      const productsList = productsSnapshot.docs.map(doc => { return {...doc.data(), id: doc.id} })

      setProducts(productsList)
      setProductsLoading(false)
    } else {
      console.log("Product documents does not exist!")
    }
  };

  // Cart handlers
  // Fetch cart collection by user id
  const getCart = async () => {
    let userId = userInfo != null ? userInfo.uid != null && userInfo.uid : ""
    const cartQuery = await query(collection(db, "cart"), where("userID", "==", userId))
    const docSnap = await getDocs(cartQuery)
    const items = []
    
    if (!docSnap.empty) {
      for (const document of docSnap.docs) {
        const productRef = doc(db, "products", document.data().productID);
        const productSnap = await getDoc(productRef);

        items.push({ product: productSnap.data(), ...document.data(), id: document.id })
      }

      setCart(items)
    } else {
      console.log("Cart documents does not exist!");
      setCart({})
    }

    setCartLoading(false)
  }
  
  // Add product to cart by user id
  const addToCart = async (product) => {
    const cartRef = collection(db, "cart")
    const cartQuery = await query(cartRef, where("userID", "==", userInfo.uid), where("productID", "==", product.id))
    const cartSnap = await getDocs(cartQuery);
        
    if (cartSnap.empty) {
      const addCartRef = doc(cartRef)
      const data = { productID: product.id, userID: userInfo.uid, quantity: 1 }
      
      await setDoc(addCartRef, data)
      const cartData = { ...data, product: product, id: addCartRef.id }
      let cartLength = cart.length
      setCart(cartLength === 0 ? cartData : (!Array.isArray(cart) ? [cart, cartData] : [...cart, cartData]))
      setAlertProps({
        open: true,
        addStatus: true
      })
    } else {
      setAlertProps({
        open: true,
        addStatus: false
      })
    }
  }

  // Update product quantity from cart by cart id
  const updateCart = async (cartItem, quantity) => {
    const cartRef = doc(db, "cart", cartItem.id)
    const cartSnap = await getDoc(cartRef)
    cartItem.quantity = quantity

    if (cartSnap.exists()) {
      await updateDoc(cartRef, { quantity: quantity })
      setCart([...cart])
    } else {
      setCartAlertProps({
        open: true,
        addStatus: false
      })
    }
  }
  
  // Remove product from user cart by product id
  const removeFromCart = async (cartId) => {
    const cartRef = doc(db, "cart", cartId)
    const cartSnap = await getDoc(cartRef)

    if (cartSnap.exists()) {
      await deleteDoc(cartRef)
      setCart(cart.filter((item) => item.id !== cartId))
    } else {
      setCartAlertProps({
        open: true,
        addStatus: false
      })
    }
  }
  
  // Enable authentication here, maybe it's time to jump to firebase from here. Before implementing this empty cart function
  const emptyCart = async () => {
    const cartRef = collection(db, "cart")
    const cartQuery = await query(cartRef, where("userID", "==", userInfo.uid))
    const cartSnap = await getDocs(cartQuery)

    if (!cartSnap.empty) {
      for (const document of cartSnap.docs) {
        const cartItemRef = doc(cartRef, document.id)
        const cartItemSnap = await getDoc(cartItemRef)

        if (cartItemSnap.exists()) {
          await deleteDoc(cartItemRef)
        }
      }

      setCart([])
      setCartAlertProps({
        open: true,
        addStatus: false,
        delete: true
      })
    } else {
      setCartAlertProps({
        open: true,
        addStatus: false,
        delete: false
      })
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const isUserLogged = await getAuth().currentUser;
        setState(Boolean(isUserLogged) ? "loggedin" : "loading");
      }
      catch (e) {
        setState("redirect");
      }
    })()
    setUserInfo(userInfo)

    getProducts()
    getCart()
  }, [userInfo])

  return (
    <div className={classes.root}>
      <AuthContextProvider>
        <Router>
          {state === "loading" ? <> <div className={classes.toolbar} /> <Loading message="Getting things ready..." /> </> :
            <>
            <ThemeProvider theme={theme}>
              <NavBar loadingRef={loadingRef} cartTotal={Array.isArray(cart) ? cart.length : Object.keys(cart).length !== 0 ? 1 : 0} userInfo={userInfo} />
                <Switch>
                <UnauthenticatedRoute exact path="/signup" loadingRef={loadingRef} userInfo={userInfo} component={Signup} />
                <UnauthenticatedRoute exact path="/signin" loadingRef={loadingRef} userInfo={userInfo} component={Signin} />
                <Route exact path="/" component={() => <Main loadingRef={loadingRef} state={state} products={products} addToCart={addToCart} loading={productsLoading} alertProps={alertProps} handleClose={handleClose} />} />
                <AuthenticatedRoute exact path="/cart" component={() => <Cart loadingRef={loadingRef} userInfo={userInfo} cart={cart} updateCart={updateCart} removeFromCart={removeFromCart} emptyCart={emptyCart} loading={cartLoading} alertProps={cartAlertProps} handleSnackbarClose={handleClose} />} />
                <Route component={NotFound}/>
              </Switch>
            </ThemeProvider>
            </>
          }
        </Router>
      </AuthContextProvider>
    </div>
  );
}

export default App;
