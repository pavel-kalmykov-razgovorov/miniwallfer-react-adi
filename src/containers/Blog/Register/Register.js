import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import './Register.css'

export default class Register extends Component {
    state = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        birthdate: '',
        error: null,
    }

    registerHandler = () => {
        const data = {
            username: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthdate: this.state.birthdate,
        }
        axios.post('/users', data)
            .then(response => {
                this.props.history.replace('/login')
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
        return <div style={{ paddingTop: '30vh' }}>
            <div className='Register'>
                <h1>Nuevo usuario</h1>
                <input className="form-control" type="text" placeholder="usuario" value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} />
                <input className="form-control" type="password" placeholder="contraseña" value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} />
                <input className="form-control" type="text" placeholder="nombre" value={this.state.firstName} onChange={(event) => this.setState({ firstName: event.target.value })} />
                <input className="form-control" type="text" placeholder="apellidos" value={this.state.lastName} onChange={(event) => this.setState({ lastName: event.target.value })} />
                <input className="form-control" type="date" placeholder="fecha de nacimiento" value={this.state.birthdate} onChange={(event) => this.setState({ birthdate: event.target.value })} />
                {this.state.error}
                <button className="btn btn-success" onClick={this.registerHandler}>Registarse</button>
            <NavLink className="btn btn-info" to="/login"> Iniciar Sesión</NavLink>
            </div>
        </div>
    }
}