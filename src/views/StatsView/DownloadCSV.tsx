'use client'
import { CSVLink } from 'react-csv';

type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  label: string;
}

type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  headers: Array<ColumnDefinitionType<T, K>>;
}

const DownloadCSV = <T, K extends keyof T>({ data, headers }: TableProps<T, K>) => {
  console.log(data,headers)
  // constructor(props: {}) {
  //     super(props);

  //     this.state = {
  //       listOfUsers: [],
  //       loading: false
  //     };
  // }

  // getUsers = (event, done) => {
  //   if(!this.state.loading) {
  //     this.setState({
  //       loading: true
  //     });
  //     axios.get("/api/users").then((userListJson) => {
  //       this.setState({
  //         listOfUsers: userListJson,
  //         loading: false
  //       });
  //       done(true); // Proceed and get data from dataFromListOfUsersState function
  //     }).catch(() => {
  //       this.setState({
  //         loading: false
  //       });
  //       done(false);
  //     });
  //   }
  // }

  // dataFromListOfUsersState = () => {
  //   return this.state.listOfUsers;
  // }

  // render() {
  //   const {loading} = this.state;
  //   return <CSVLink
  //     data={this.dataFromListOfUsersState}
  //     asyncOnClick={true}
  //     onClick={this.getUsers}
  //   >
  //     {loading ? 'Loading csv...' : 'Download me'}
  //   </CSVLink>;
  // }
  return (
    <CSVLink data={data as []} headers={headers as []} asyncOnClick={true} enclosingCharacter={''} target="_blank">
      Download CSV
    </CSVLink>
  );
};
export default DownloadCSV;
