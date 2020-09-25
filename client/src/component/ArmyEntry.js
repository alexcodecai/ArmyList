import React from "react";


const UserEntry = props => {
  const imageStyle = {width: 50, height: 50};
  return (
    <tr>
      {/* <td>{props.army.avatar}</td> */}
      <td><img style={imageStyle} src={props.army.avatar} alt='profileImage'/></td>
      <td>{props.army.name}</td>
      <td>{props.army.sex}</td>
      <td>{props.army.rank}</td>
      <td>{props.army.startDate}</td>
      <td>{props.army.phone}</td>
      <td>{props.army.email}</td>
      <td onClick ={e => props.showSuperior(e, props.army._id)}>{props.army.superior}</td>
      <td>{props.army.subordinate.length}</td>
      <td>Edit</td>
      <td>Delete</td>
    </tr>
  );
};
export default UserEntry;
