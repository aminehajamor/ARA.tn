import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios'
import Post from './components/Post.jsx';
import Preview from './components/Preview.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import HomePage from './components/HomePage.jsx';
import Profile from './components/Profile.jsx';
import Postviewonclick from './components/Postviewonclick.jsx';
import Filteroption from "./components/Filteroption.jsx"
import Edit from './components/Edit.jsx';
import Admin from './components/Admin.jsx';
/*
  READ THESE COMMENTS AS A PART OF STEP TWO
  To manage switching among the different views in this application, 
  we have implemented a "view switcher" in the `App` component. 
  There are three key parts to the view switcher:
    1. The `view` property defined on the `App` component's `state`
    2. The `changeView` method defined on the `App` component
    3. The `renderView` method defined on the `App` component
  The value of the `view` property will determine which gets returned by the
  `renderView` method, which is invoked inside the `App` component's `render`. 
  You can set the initial value of `view` in the `App` component's `constructor`
  function, determining what view gets rendered "by default".
  If you haven't modified this code yet, the view switcher observes the following rules:
  - The default view is 'feed'
  - If the view is set to 'feed', the `<Feed>` component is displayed
  - If the view is set to any other value, the `<Post>` component is displayed
  - The `changeView` function should change the value of `view` in the `App` component's state.
  You'll make some refactors and additions to this view switcher throughout the
  next steps of the assessment. When you're ready, return to the README.
*/

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      view: 'preview',
      userData: {
        admin: false,
        user: true,
        ghost: false
      },
      username: "",
      password: "",
      data: [],
      showHideNav: false,
      lift: {},
      allfiltreddata: [],
      item : ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.changeView = this.changeView.bind(this);
    this.connect = this.connect.bind(this)
  }

  handleChange(e) {
    console.log(this.state)
    this.setState({
      [e.target.name]: e.target.value
    })
  }



  changeView(option,item) {
    var filter = this.state.data.filter((e) => {
      return e._id === option
    })
    var filterbytype = this.state.data.filter((e)=>{
      return e.type === option
    })


    this.setState({
      view: option,
      lift: filter[0],
      allfiltreddata : filterbytype,
      item : item
    })
    this.fetch()
  }
  connect() {

    axios.get('/api/user', this.state)
      .then(data => {
        console.log(data)
        if (data.data.username === "admin") {
          this.setState({
            userData: {
              admin: true,
              user: false,
              ghost: false
            }
          })
          this.changeView("admin")
        }
        if (data.data.username === "ghost") {
          this.setState({
            userData: {
              admin: false,
              user: false,
              ghost: true
            }
          })
        }
        else {
          this.setState({
            userData: {
              admin: false,
              user: true,
              ghost: false
            },
            username: data.data,
            showHideNav: true
          })
          this.changeView("homePage")
        }
      })
      .catch(err => {
        console.log(err)
      })


  }

  renderView() {
    const { view } = this.state;
    if (view === 'preview') {

      return <Preview data={this.state.data} changeView={this.changeView} handleClick={() => this.changeView('anypostview')} />
    } else if (view === 'post') {
      return <Post change = {this.changeView} user = {this.state.username} alldata = {this.state.data} />
    } else if (view === 'signup') {
      return <Signup changeView={this.changeView} handleChange={this.handleChange} />
    }
    // else if (this.state.username === "Admin"){
    //   return <Admin  data = {this.state.data}/>
    // }
    else if (view === "filterop"){
      return <Filteroption data = {this.state.allfiltreddata}/>
    }
    else if (view === "edit"){
      return <Edit item = {this.state.item} lift = {this.state.lift}/>
    }
  
    else if (view === "profile") {
      return <Profile change={this.changeView} data={this.state.data} user={this.state.username} />
    }
    else if (view === 'login') {
      return <Login changeView={this.changeView} handleChange={this.handleChange} connect={this.connect} />
    } else if (view === 'homePage') {
      return <HomePage username={this.state.username} data={this.state.data} change={this.changeView}  />
    }
    else{
      return <Postviewonclick lift={this.state.lift} />
  }
}
componentDidMount(){
  this.fetch()
}
fetch(){
  $.get("/api/user/announce")
    .then(data => {
      this.setState({
        data: data
      })
      console.log(data)


    })
    .catch(err => console.log("errrr"))
}


render() {
  return (
    <div>
      <div className="nav" >
        <span className="logo"
          onClick={() => this.changeView('homePage') 
          }
          >
          ARA.TN
        </span>
        <select id="id_name" name="name">
       <option value=""></option>
    <option value="3">Houses For Rent</option>
    <option value="4">Houses For Sale   </option>
    <option value="5"> Cars For Rent  </option>
    <option value="6">Cars For Sale </option>
    <option value="7"> Phones </option>
</select> 
<button onClick = {()=>this.changeView("filterop")}>filter</button>
        
        {this.state.showHideNav &&
          <span className={this.state.view === ''
            ? 'nav-selected'
            : 'nav-unselected'}
            onClick={() => this.changeView('profile')}>
            My Profile
          </span>} {this.state.showHideNav &&
            <span className={this.state.view === 'post'
              ? 'nav-selected'
              : 'nav-unselected'} onClick={() => this.changeView('post')}>
              Create a Post
            </span>}{this.state.showHideNav &&
              <span className="nav-unselected" onClick={() => this.changeView('preview')}>
                Log Out
              </span>}{!this.state.showHideNav &&
                <span className="nav-selected" onClick={() => this.changeView('signup')}>
                  Sign up For FREE
                </span>}
      </div>

      <div className="main">
        {this.renderView()}
      </div>
    </div>
  )
}
  }



ReactDOM.render(<App />, document.getElementById('Ara.tn'));