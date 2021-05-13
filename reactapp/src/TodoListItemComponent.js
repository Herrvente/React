import { Draggable } from "react-beautiful-dnd";
import { ListGroup, Button, Accordion, Card } from "react-bootstrap";

export function TodoListItemComponent(props) {
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <Draggable
      key={props.el.id}
      index={props.index}
      draggableId={props.el.id.toString()}
    >
      {(provided, snapshot) => {
        return (
          <ListGroup.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Accordion>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                <Card.Title>{props.el.title}</Card.Title>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {props.el.body}
                  <Card.Text>
                    <small className="text-muted">
                      {formatDate(props.el.date)}
                    </small>
                  </Card.Text>
                </Card.Body>
              </Accordion.Collapse>
            </Accordion>
            <button
              type="button"
              onClick={() => props.DeleteTodo(props.el.id)}
              className="close"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </ListGroup.Item>
        );
      }}
    </Draggable>
  );
}
