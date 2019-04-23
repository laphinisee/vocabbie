import React from "react";
import {Anchor, Button, Box, Heading, Table, TableBody, TableRow, TableCell} from 'grommet';
import {AddCircle} from 'grommet-icons'
import './index.css';
import Container from './Container';
import TextTruncate from 'react-text-truncate'; 

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {articles: []};
    }

    componentWillMount() {
      const userid = '5cbe5ca7c24928cdc7f0dfc2';
      const url = '/' + userid + '/vocab';
      fetch(url).then( (res) => res.json()).then((res) => {
        console.log(res)
        const getData = res
        this.setState({articles: getData})
      })
    }


    render() {
      return (
        <Container title="Your Sheets" description="All the sheets you've generated in the past.">
          <Button icon={<AddCircle />} label="New Sheet" href="/create" alignSelf="end" color="white"/>
          <Table>
            <TableBody>
            {this.state.articles.map( (article, i) => (
              <TableRow key={i}>
                <TableCell scope="row" size="1/2">
                  <Heading size="small"><Anchor href={"/display/" + article.id} color="neutral-2">{article.title}</Anchor></Heading>
                </TableCell>
                <TableCell size="1/2" round="small" background="light-2">
                  <Box elevation="xsmall" pad="small" round="small" background="white" margin="xxsmall">
                    <TextTruncate text={article.preview} line={3} className="article-excerpt-text"/>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </Container>
      )
    }
  }

  export default VocabDisplay;


