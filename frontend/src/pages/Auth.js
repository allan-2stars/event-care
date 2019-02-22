import React, { Component } from 'react';

import './Auth.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = event => {
    // prevent default behaviour
    event.preventDefault();
    // get email and password
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    // send to backend
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createUser(userInput:{email:"${email}", password:"${password}"}){
            _id
            email
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.statua !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
    ///
  };
  render() {
    return (
      <form className='auth-form' onSubmit={this.submitHandler}>
        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' ref={this.emailEl} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' ref={this.passwordEl} />
        </div>
        <div className='form-actions'>
          <button type='button'>Switch to Login</button>
          <button type='submit'>Submit</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
