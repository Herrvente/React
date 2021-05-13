import { TodoListItemComponent } from "./TodoListItemComponent";
import { Droppable } from "react-beautiful-dnd";
import "./App.css";
import { ListGroup, Card } from "react-bootstrap";

export function ListGroupComponent(props) {
  return (
    <Card style={{ width: "15rem" }} border="dark" key={props.kulcs} bg="light">
      <Card.Header> {props.data.title}</Card.Header>
      <Droppable droppableId={props.kulcs}>
        {(provided) => {
          return (
            <ListGroup>
              <ListGroup.Item variant="dark">
                <ListGroup ref={provided.innerRef} {...provided.droppableProps}>
                  {props.data.items.map((el, index) => {
                    return (
                      <TodoListItemComponent
                        key={index.toString()}
                        DeleteTodo={props.DeleteTodo}
                        setTodo={props.setTodo}
                        el={el}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          );
        }}
      </Droppable>
    </Card>
  );
}
