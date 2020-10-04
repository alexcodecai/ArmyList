import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";


const UserEntry = props => {
  const imageStyle = { width: 50, height: 50 };
  //console.log('entry', props.army)
  // if (props.army.superiorID === undefined) {
  //   return <p>loading....</p>;
  // }
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
          props.army.superiorID === undefined ? null : { cursor: "pointer", color: "grey" }
        }
        onClick={
          props.army.superiorID === undefined
            ? null
            : e => props.showSuperior(e, props.army.superiorID._id)
        }
      >
        {props.army.superiorID ? props.army.superiorID.name : null}
      </td>
      <td
        style={
          props.army.subordinate.length > 0? { cursor: "pointer", color: "grey" } : null
        }
        onClick={
          props.army.subordinate.length > 0
            ? e => props.showSubordinate(e, props.army._id)
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
       onClick = { () => props.removeArmy(props.army._id)}
      >Delete</td>
    </tr>
  );
};
export default UserEntry;
