import React from "react";
import {Anchor, Button, Box, Heading, Table, TableBody, TableRow, TableCell} from 'grommet';
import {AddCircle} from 'grommet-icons'
import './index.css';
import Container from './Container';
import TextTruncate from 'react-text-truncate'; 

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    }

    componentWillMount() {
      const getData = {}
      const articles = [
        {text: 'je manger. \n\n\n\n je toucher', title: 'My First Article', id: '5'}, 
        {text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut gravida ex, ut aliquam lorem. Nullam id mollis nulla. Aliquam eleifend nisl sed metus placerat consequat. Proin et fermentum nulla. Nam finibus dolor non orci pulvinar scelerisque. Donec ac est non ex porta laoreet. Nunc sit amet lectus velit. Ut scelerisque, urna eu molestie iaculis, lacus mauris tincidunt ligula, non ullamcorper enim leo ut quam. Fusce fringilla ligula a ultrices pulvinar. Duis euismod odio eu ligula consectetur, sed consequat diam malesuada. Vestibulum eleifend pulvinar facilisis. Proin molestie tristique risus et faucibus. Fusce aliquet, felis ac efficitur pulvinar, elit odio euismod sem, ac lobortis nulla justo eget nulla. Nam vitae venenatis nisl. Donec varius elit non ante facilisis facilisis. \nClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus venenatis semper sapien, sit amet varius tellus finibus in. Fusce faucibus vulputate tortor vel vestibulum. Praesent id felis at erat maximus mollis. Vivamus pellentesque orci ullamcorper, aliquet tellus a, imperdiet ipsum. Vestibulum non massa at dui ornare sollicitudin sed nec massa. Nunc hendrerit mi odio, eget pellentesque velit mattis eget. Cras non dolor est. Maecenas aliquet, lectus non rhoncus euismod, lectus mi bibendum neque, ac sollicitudin orci turpis ac metus. Suspendisse sed leo dui. Nulla luctus odio et pretium condimentum.', 
          title: 'My Second Article', id: '6'}]
      this.setState({
        articles
      })
    }


    render() {
      return (
        <Container title="Your Sheets" description="All the sheets you've generated in the past.">
          <Button icon={<AddCircle />} label="New Sheet" href="/create" alignSelf="end" color="white"/>
          <Table>
            <TableBody>
            {this.state.articles.map( (article, i) => (
              <TableRow>
                <TableCell scope="row" size="1/2">
                  <Heading size="small"><Anchor href={"/display/" + article.id} color="neutral-2">{article.title}</Anchor></Heading>
                </TableCell>
                <TableCell size="1/2" round="small" background="light-2">
                  <Box elevation="xsmall" pad="small" round="small" background="white" margin="xxsmall">
                    <TextTruncate text={article.text} line={3} className="article-excerpt-text"/>
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


