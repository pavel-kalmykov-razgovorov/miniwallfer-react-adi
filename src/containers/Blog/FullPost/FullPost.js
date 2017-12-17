import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
    state = {
        loadedPost: null
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate() {
        this.loadData();
    }

    checkAuth = () => {
        if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {
            this.props.loginFailed()
        }
    }

    loadData() {
        this.checkAuth()
        if (this.props.match.params.id) {
            if (!this.state.loadedPost || (this.state.loadedPost && this.state.loadedPost.id !== +this.props.match.params.id)) {
                axios.get('/posts/' + this.props.match.params.id)
                    .then(response => {
                        this.setState({ loadedPost: response.data._embedded });
                    })
                    .catch(err => this.props.history.replace('/posts'));
            }
        }
    }

    editPostHandler = () => {
        this.checkAuth()
        this.props.history.push(`/edit-post/${this.state.loadedPost.id}`)
    }

    deletePostHandler = () => {
        this.checkAuth()
        axios.delete(`/users/${this.state.loadedPost.user._embedded.id}/posts/${this.props.match.params.id}`)
            .then(response => {
                console.log(response);
                this.props.deleted();
                this.props.history.replace('/posts')
            })
            .catch(err => this.props.history.replace('/posts'));
    }

    render() {
        let post = <p style={{ textAlign: 'center' }}>Por favor selecciona un post</p>;
        if (this.props.match.params.id) {
            post = <p style={{ textAlign: 'center' }}>Cargando...</p>;
        }
        const editOptions =  this.state.loadedPost && this.state.loadedPost.user._embedded.id === +localStorage.getItem('userId')
            ? <div className="Edit">
                <button onClick={this.editPostHandler} className="btn btn-info">Editar</button>
                <button onClick={this.deletePostHandler} className="btn btn-danger">Eliminar</button>
            </div>
            : null
        if (this.state.loadedPost) {
            post = (
                <div className="FullPost card">
                    <div className="card-block">
                        <h4 className="card-title FullPostAuthor">{`${this.state.loadedPost.user._embedded.firstName} ${this.state.loadedPost.user._embedded.lastName} (${this.state.loadedPost.user._embedded.username})`}</h4>
                        <p className='card-text'>{this.state.loadedPost.text}</p>
                        {editOptions}
                    </div>
                </div>

            );
        }
        return post;
    }
}

export default FullPost;