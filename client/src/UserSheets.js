import React from "react";
import {Anchor, Button, Box, Heading, Text, Table, TableBody, TableRow, TableCell} from 'grommet';
import {AddCircle} from 'grommet-icons'
import './index.css';
import Container from './Container';
import TextTruncate from 'react-text-truncate'; 
import { withRouter } from "react-router";

const EmptySheet = () => {
  return (
    <Box
      border={{
        "color": "border",
        "size": "small",
        "style": "dashed",
        "side": "all"
      }}
      margin={{
        "vertical": "medium"
      }}
      pad={{
        "horizontal": "xlarge"
      }}
      align="center"
      >
      <Heading
        color="border"
        textAlign="center"
        margin={{
          top: 'xlarge',
          bottom: 'xsmall',
        }}
      >
        You don't have any sheets yet!
      </Heading>
      <Text
        color="border"
        textAlign="center"
        margin={{
          top: 'xsmall',
          bottom: 'xlarge',
        }}
        size="medium"
        style={{
          "maxWidth": "500px"
        }}
      >
        With Vocabbie, you can learn from content you're interested in. To get started, click "New Sheet" and upload some content!
      </Text>
    </Box>
  )
}

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
    };
  }

  componentWillMount() {
    fetch('/vocab', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.user.token,
      },
    }).then( (res) => res.json()).then((res) => {
      const getData = res
      this.setState({articles: getData, loading: false})
    }).catch(err => {
      console.error(err)
      this.props.history.push('/error')
    })
  }


    render() {
      return (
        <Container loading={this.state.loading} title="Your Sheets" description="All the sheets you've generated in the past.">
          <Button icon={<AddCircle />} label="New Sheet" href="/create" alignSelf="end" color="white"/>
          {this.state.articles.length > 0 ?
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
          </Table> : <EmptySheet/>}
        </Container>
      )
    }
  }

  export default withRouter(VocabDisplay);


