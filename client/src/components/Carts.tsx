import dateFormat from 'dateformat';
import { History } from 'history';
import update from 'immutability-helper';
import * as React from 'react';
import Images2 from '../images/cart.jpg';
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import { createCart, deleteCart, getCarts, patchCart } from '../api/carts-api';
import Auth from '../auth/Auth';
import { Cart } from '../types/Cart';
import { Snackbar } from '@material-ui/core';



interface CartsProps {
  auth: Auth;
  history: History;
}

interface CartsState {
  todos: Cart[];
  newTodoName: string;
  loadingTodos: boolean;
  error: string;
  attachmentUrl: string;
  showNotification: boolean;
  notificationMessage: string;
}

export class Carts extends React.PureComponent<CartsProps, CartsState> {
  state: CartsState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    error: '',
    attachmentUrl: '',
    showNotification: false,
    notificationMessage: '',
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value });
  };

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`);
  };

  onTodoCreate = async () => {
    try {
      const { newTodoName } = this.state;

      if (newTodoName === '') {
        this.setState({ error: 'Can not be empty' });
        return;
      } else if (newTodoName.length > 20) {
        this.setState({ error: 'Cart name cannot exceed 20 characters' });
        return;
      } else {
        const price = this.calculateDueDate();
        const description = "new product";
        const newTodo = await createCart(this.props.auth.getIdToken(), {
          name: this.state.newTodoName,
          price,
          description
        });
        this.setState({
          todos: [...this.state.todos, newTodo],
          newTodoName: '',
        });
      }
    } catch {
      alert('Todo creation failed');
    }
  };

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteCart(this.props.auth.getIdToken(), todoId);
      this.setState(
        {
          todos: this.state.todos.filter((todo) => todo.todoId !== todoId),
          showNotification: true,
          notificationMessage: 'Todo deleted successfully!',
        },
        () => {
          // Hide the notification after 3 seconds
          setTimeout(() => {
            this.setState({ showNotification: false });
          }, 3000);
        }
      );
    } catch {
      alert('Todo deletion failed');
    }
  };

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos];
      await patchCart(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        price: todo.price,
        description: todo.description,
        done: !todo.done,
      });
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } },
        }),
      });
    } catch {
      alert('Todo deletion failed');
    }
  };

  async componentDidMount() {
    try {
      const todos = await getCarts(this.props.auth.getIdToken());
      this.setState({
        todos,
        loadingTodos: false,
      });
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`);
    }
  }

  render() {
    return (
      <div>
        <img src={Images2} style={{ width: '100%', height:'400px' }} alt="Image 1"  />
        {this.renderCreateTodoInput()}
        {this.renderTodos()}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.showNotification}
          autoHideDuration={3000}
          onClose={() => this.setState({ showNotification: false })}
          message={this.state.notificationMessage}
        />
      </div>
    );
  }

  renderCreateTodoInput() {
    const { error } = this.state;

    return (
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
            error={!!error}
            helperText={error}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={this.onTodoCreate}
          >
            New task  
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    );
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading();
    }

    return this.renderTodosList();
  }

  renderLoading() {
    return (
      <Grid item xs={12}>
        <Typography>Loading TODOs...</Typography>
      </Grid>
    );
  }

  renderTodosList() {
    return (
      <Grid container direction="column" spacing={1}>
        {this.state.todos.map((todo, pos) => (
          <Grid item key={todo.todoId}>
            <Grid container alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography>{todo.name}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>{todo.description}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>{todo.price}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  Delete
                </Button>
              </Grid>
              {todo.attachmentUrl && (
                <Grid item xs={12}>
                  <div style={{ maxWidth: '200px', maxHeight: '200px' }}>
                  <img
                    src={todo.attachmentUrl}
                    alt="Attachment"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  }
  generateRandomPrice(min: number, max: number): number {
    // Tạo giá tiền ngẫu nhiên trong khoảng từ min đến max
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  calculateDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    const randomPrice: number = this.generateRandomPrice(100, 1000);

    return `${randomPrice}$ -exp: ${date.toISOString().split('T')[0]}`;
  }
  
}
