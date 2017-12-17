import React, { Component } from 'react'
// import axios from 'axios'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'

import './Blog.css'
import Posts from './Posts/Posts'
import asyncComponent from '../../hoc/asyncComponent'
import Login from './Login/Login'
import Register from './Register/Register'

const AsyncNewPost = asyncComponent(() => {
    return import('./NewPost/NewPost')
})

class Blog extends Component {
    state = {
        auth: localStorage.getItem('token') && localStorage.getItem('userId')
    }

    loginSuccessHandler = () => { this.setState({ auth: true }) }
    loginFailedHandler = () => this.setState({ auth: false })

    render() {
        let components = <Switch>
            <Route path="/register" exact render={(props) => <Register {...props} loginSuccess={this.loginSuccessHandler} />} />
            <Route path="/login" render={(props) => <Login {...props} loginSuccess={this.loginSuccessHandler} />} />
            <Redirect from="/" to="/login" />
        </Switch>
        let navigationItems = null
        if (this.state.auth) {
            components = <Switch>
                <Route path="/new-post" render={(props) => <AsyncNewPost {...props} loginFailed={this.loginFailedHandler} />} />
                <Route path="/edit-post/:id" render={(props) => <AsyncNewPost {...props} loginFailed={this.loginFailedHandler} />} />
                <Route path="/posts" render={(props) => <Posts {...props} loginFailed={this.loginFailedHandler} />} />
                <Redirect from="/" to="/posts" />
            </Switch>
            navigationItems = <ul className="nav nav-pills" style={{backgroundColor: '#e3f2fd'}}>
                <li className="nav-item"><NavLink className="nav-link" to="/posts/" exact>Posts</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/new-post" exact>New Post</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/login" exact onClick={() => localStorage.clear()}>Logout</NavLink></li>
            </ul>
        }
        return (
            <div className="Blog">
                <header>
                    <nav>
                        {navigationItems}
                    </nav>
                </header>
                <div>
                    {components}
                </div>
            </div>
        )
    }
}

export default Blog