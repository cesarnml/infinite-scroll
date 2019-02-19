import React, { Component } from 'react';
import axios from 'axios';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      page: 0,
      loading: false,
      prevY: 0,
    };
  }

  componentDidMount() {
    const { page } = this.state;
    this.getUsers(page);

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(this.handleObserver, options);
    this.observer.observe(this.loadingRef);
  }

  handleObserver = (entities, observer) => {
    console.log(entities);
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      const lastUser = this.state.users[this.state.users.length - 1];
      const curPage = lastUser.id;
      this.getUsers(curPage);
      this.setState({ page: curPage });
    }
    this.setState({ prevY: y });
  };

  getUsers = page => {
    this.setState({ loading: true });
    axios
      .get(`https://api.github.com/users?since=${page}&per_page=100`)
      .then(res => {
        this.setState({
          users: [...this.state.users, ...res.data],
          loading: false,
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    const loadingCSS = {
      height: '100px',
      margin: '30px',
      border: '1px solid blue',
    };

    const loadingTextCSS = { display: this.state.loading ? 'block' : 'none' };

    return (
      <div className="container">
        <div style={{ minHeight: '800px', border: '1px solid red' }}>
          <ul>
            {this.state.users.map(user => (
              <li key={user.id}>
                <img
                  height="100px"
                  width="100px"
                  style={{ borderRadius: '50%' }}
                  src={user.avatar_url}
                />
              </li>
            ))}
          </ul>
        </div>
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    );
  }
}

export default App;
