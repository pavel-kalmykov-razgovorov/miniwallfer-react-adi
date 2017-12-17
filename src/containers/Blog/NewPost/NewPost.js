import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import './NewPost.css'


class NewPost extends Component {
    state = {
        content: '',
        submitted: false,
        error: null
    }

    checkAuth = () => {
        if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {
            this.props.loginFailed()
        }
    }

    componentDidMount() {
        this.checkAuth()
        if (this.isEditPost()) {
            axios.get(`/users/${localStorage.getItem('userId')}/posts/${this.props.match.params.id}`)
                .then(response => {
                    this.setState({ content: response.data._embedded.text })
                })
                .catch(err => {
                    this.props.history.replace(`/posts`)
                })
        }
    }

    postDataHandler = () => {
        this.checkAuth()
        if (this.state.content !== '') {
            const data = { text: this.state.content }
            if (!this.isEditPost()) {
                axios.post(`/users/${localStorage.getItem('userId')}/posts`, data)
                    .then(() => this.props.history.replace('/posts'))
                    .catch(err => {
                        this.setState({ error: <p>El servidor ha devuelto un error {err.response.status} ({err.response.statusText})</p> })
                    })
            } else {
                axios.put(`/users/${localStorage.getItem('userId')}/posts/${this.props.match.params.id}`, data)
                    .then(() => this.props.history.replace(`/posts/${this.props.match.params.id}`))
                    .catch(err => {
                        this.setState({ error: <p>El servidor ha devuelto un error {err.response.status} ({err.response.statusText})</p> })
                    })
            }
        } else {
            this.setState({ error: <p>No puedes dejar el contenido del post vacío</p> })
        }
    }

    isEditPost = () => this.props.match.params.id

    render() {
        let redirect = null

        if (this.state.submitted) {
            redirect = <Redirect to="/posts" />
        }
        const title = this.isEditPost() ? 'Editar post' : 'Nuevo Post'
        const submitText = this.isEditPost() ? 'Guardar cambios' : 'Añadir Post'
        return (
            <div className="NewPost">
                {redirect}
                <h1>{title}</h1>
                <label htmlFor="content">Escribe aquí:</label>
                <textarea id="content" className="form-control" rows="6" value={this.state.content} onChange={(event) => this.setState({ content: event.target.value })} />
                <small id="emailHelp" className="form-text text-muted">¡Intenta ser agradable!</small>
                {this.state.error ? <div class="alert alert-danger" role="alert">{this.state.error}</div> : null}
                <button className="btn btn-primary" onClick={this.postDataHandler}>{submitText}</button>
            </div>
        )

    }
}

export default NewPost
