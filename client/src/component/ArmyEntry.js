import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";


const UserEntry = props => {
  const imageStyle = { width: 50, height: 50 };

  return (
    <tr>
      {/* <td>{props.army.avatar}</td> */}
      <td>
        <img style={imageStyle} src={props.army.avatar} alt="profileImage" />
      </td>
      <td>{props.army.name}</td>
      <td>{props.army.sex}</td>
      <td>{props.army.rank}</td>
      <td>{props.army.startDate}</td>
      <td><a href={`tel:${props.army.phone}`} >{props.army.phone}</a ></td>
      <td><a href={`mailto:${props.army.email}`}>{props.army.email}</a></td>
      <td
        style={
          props.army.superior === ' ' ? null : { cursor: "pointer", color: "grey" }
        }
        onClick={
          props.army.superior === ' '
            ? null
            : e => props.showSuperior(e, props.army.superior)
        }
      >
        {props.army.superior}
      </td>
      <td
        style={
          props.army.subordinate ? { cursor: "pointer", color: "grey" } : null
        }
        onClick={
          props.army.subordinate 
            ? e => props.showSubordinate(e, props.army.subordinate)
            : null
        }
      >
        {props.army.subordinate.length}
      </td>
      <td>
        <Link to={`/EditArmy/${props.army._id}`}>
          <EditIcon />
          edit
        </Link>
      </td>
      <td
       style = { {cursor : "pointer", color: "black"}}
       onClick = { () => props.removeArmy(props.army._id, props.army.superior, props.army.subordinate, props.army.name)}
      >Delete</td>
    </tr>
  );
};
export default UserEntry;
