import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';

import Header from './components/header/header.component';
import SignIn from './components/sign-in/sign-in.component';
import SignUp from './components/sign-up/sign-up.component';

import CheckoutPage from './pages/checkout/checkout.page';
import ContactPage from './pages/contact-page/contact.page';
import Homepage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.action';
import { connect } from 'react-redux';
import { selectCurrentUser } from './redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';

import './App.css';

class App extends React.Component {
  unSuscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unSuscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      }

      setCurrentUser(userAuth);
    })
  }

  componentWillUnmount() {
    this.unSuscribeFromAuth();
  }

  render() {
    return (
      <div className="App">
        <Header />

        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/checkout' component={CheckoutPage} />
          <Route exact path='/contact' component={ContactPage} />
          <Route exact path='/signin' render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignIn />)}  />
          <Route exact path='/signup' render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignUp />)}  />
        </Switch>

      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
