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
      <td>{props.army.phone}</td>
      <td>{props.army.email}</td>
      <td
        style={
          props.army.superior ? { cursor: "pointer", color: "grey" } : null
        }
        onClick={
          props.army.superior
            ? e => props.showSuperior(e, props.army.superior)
            : null
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
       onClick = { e=> props.removeArmy(e, props.army_id, props.army.name, props.army.superior)}
      >Delete</td>
    </tr>
  );
};
export default UserEntry;
