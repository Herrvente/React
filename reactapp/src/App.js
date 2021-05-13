import "./App.css";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";

import {
  Container,
  Row,
  Col,
  Navbar,
  FormControl,
  Button,
  Form,
} from "react-bootstrap";

import { ListGroupComponent } from "./ListGroupComponent";

function App() {
  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [body, setBody] = useState("");
  const [state, setState] = useState();

  useEffect(() => {
    fetch("https://localhost:5001/todoitems")
      .then((response) => response.json())
      .then((json) => {
        const obj = {
          todo: {
            title: "Todo",
            items: [],
          },

          "in-progress": {
            title: "In Progress",
            items: [],
          },
          done: {
            title: "Done",
            items: [],
          },
          blocked: {
            title: "Blocked",
            items: [],
          },
        };

        //hozzáadás
        for (let i = 0; i < json.length; i++) {
          obj[json[i].tabla].items.push(json[i]);
        }
        setState(obj);
      });
  }, []);

  const Delete = (id) => {
    let tabla = "";
    let todoindex = -1;
    //melyik táblában van az item a négyből
    _.map(state, (data, key) => {
      data.items.forEach((element) => {
        if (element.id === id) {
          tabla = key;
        }
      });
    });
    fetch("https://localhost:5001/todoitems/" + id, {
      method: "DELETE",
    }).then(() => {
      setState((prev) => {
        prev = { ...prev };
        todoindex = prev[tabla].items.findIndex((e) => {
          return e.id === id;
        });
        if (todoindex !== -1) prev[tabla].items.splice(todoindex, 1);
        return prev;
      });
    });
  };

  const Register = (item) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    };
    fetch("https://localhost:5001/todoitems", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setState((prev) => {
          prev = { ...prev };

          prev["todo"].items = data;
          return prev;
        });
      });
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index && //adott táblán belüli új index === jelenlegi hely
      destination.droppableId === source.droppableId // melyik táblába === melyikből
    ) {
      return;
    }

    // Csinál egy copy itemet mielőtt törlöd a helyéről
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      //Item törlése az előző herlyről
      prev[source.droppableId].items.splice(source.index, 1);
      //Item új helyhez adása
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });

    if (destination.droppableId !== source.droppableId) {
      const params = {
        id: itemCopy.id,
        ujhely: destination.index,
        ujtabla: destination.droppableId,
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };

      const urlsearch = new URLSearchParams(params);

      fetch(
        "https://localhost:5001/todoitems/table/?" + urlsearch,
        requestOptions
      ).then((response) => response.json());
    }
    if (
      destination.index !== source.index &&
      destination.droppableId === source.droppableId
    ) {
      const params = {
        id: itemCopy.id,
        ujhely: destination.index,
        regihely: source.index,
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };

      const urlsearch = new URLSearchParams(params);

      fetch(
        "https://localhost:5001/todoitems/?" + urlsearch,
        requestOptions
      ).then((response) => response.json());
    }
  };

  return (
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Container>
            <Form
              inline
              onSubmit={(e) => {
                e.preventDefault();
                let item = {
                  title: e.target.elements.todo.value,
                  body: e.target.elements.body.value,
                  date: e.target.elements.date.value,
                };
                Register(item);
              }}
            >
              <FormControl
                required
                name="todo"
                type="text"
                placeholder="Teendő"
                className="mr-sm-2"
              />
              <FormControl
                required
                name="body"
                type="text"
                className="mr-sm-2"
                placeholder="Leírás"
              />
              <FormControl
                required
                className="mr-sm-5"
                type="date"
                name="date"
              ></FormControl>

              <Button variant="outline-light" type="submit" className="mr-sm-2">
                Új teendő hozzáadása
              </Button>
              <div>Kiss Levente - B58CND</div>
            </Form>
          </Container>
        </Navbar.Collapse>
      </Navbar>

      <Row>
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <Col key={key}>
                <ListGroupComponent
                  DeleteTodo={Delete}
                  data={data}
                  kulcs={key}
                />
              </Col>
            );
          })}
        </DragDropContext>
      </Row>
    </Container>
  );
}

export default App;
