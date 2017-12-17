import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Post from '../../../components/Post/Post';
import './Posts.css';
import FullPost from '../FullPost/FullPost';

class Posts extends Component {
    state = {
        posts: []
    }

    checkAuth = () => {
        if (!localStorage.getItem('token') || !localStorage.getItem('userId')) {
            this.props.loginFailed()
        }
    }

    componentDidMount() {
        this.checkAuth()
        axios.get('/posts?start=0&size=0')
            .then(response => {
                console.log(this.props)
                this.setState({ posts: response.data._embedded })
            })
            .catch(error => {
                console.log(error);
            });
    }

    postSelectedHandler = (id) => {
        this.props.history.push('/posts/' + id);
    }

    render() {
        let posts = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;
        if (!this.state.error) {
            if (this.state.posts.length === 0) {
                posts = <div>
                    <h1>No existe ningún post creado todavía</h1>
                    <h1 style={{ textAlign: 'center' }}><NavLink to="/new-post/" exact>¡Crea Uno!</NavLink></h1>
                </div>
            } else {
                posts = this.state.posts.map(post => {
                    return (
                        <Post
                            key={post.id}
                            text={post.text}
                            author={`${post.user._embedded.firstName} ${post.user._embedded.lastName} (${post.user._embedded.username})`}
                            clicked={() => this.postSelectedHandler(post.id)} />
                    );
                });
            }
        }

        return (
            <div style={{ backgorund: 'white' }}>
                <Route path={this.props.match.url + '/:id'} exact render={(props) => <FullPost {...props} deleted={() => this.componentDidMount()} />} />
                <h1 style={{
                    textAlign: 'center',
                    background: '#fff',
                    width: '40%',
                    display: 'block',
                    margin: '10px auto',
                    border: '3px solid #ccc'
                }}>Listado de posts</h1>
                <section className="Posts">
                    {posts}
                </section>
            </div>
        );
    }
}

export default Posts;