import React, { Component } from "react";
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

export default class Login extends Component {
    state = {
        username: '',
        password: '',
        error: null,
    }

    componentDidMount() {
        this.checkAuth()
    }

    checkAuth = () => {
        if (localStorage.getItem('token') && localStorage.getItem('userId')) {
            this.props.loginSuccess()
        }
    }

    loginHandler = () => {
        axios.post('/login', { username: this.state.username, password: this.state.password })
            .then(response => {
                localStorage.setItem('token', `Bearer ${response.data.token}`)
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
                return axios.get('/users?start=0&size=0')
            })
            .then(response => {
                localStorage.setItem('userId', response.data._embedded.filter(user => user.username === this.state.username)[0].id)
                this.props.loginSuccess()
                this.props.history.replace('/posts')
            })
            .catch(err => {
                if (err.response.status === 422) {
                    this.setState({ error: <p>Hay errores en el formulario. Comprueba tus datos</p> })
                } else {
                    this.setState({ error: <p>El servidor ha devuelto un error {err.response.status} ({err.response.statusText})</p> })
                }
            })
    }

    render() {
        return <div style={{paddingTop: '30vh'}}>
            <div className='Login'>
                <h1>Bienvenido</h1>
                <input className="form-control" type="text" placeholder="usuario" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
                <input className="form-control" type="password" placeholder="contraseña" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} />
                {this.state.error}
                <button className="btn btn-success" onClick={this.loginHandler}>Iniciar Sesión</button>
                <NavLink className="btn btn-info" to="/register">Registrarse</NavLink>
            </div>
        </div>
    }
}