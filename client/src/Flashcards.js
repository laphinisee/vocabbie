import React from "react";
import Container from './Container';
import './Flashcards.css'
import {Radial, RadialSelected} from 'grommet-icons'

class Card extends React.Component {
    constructor() {
      super();
      this.state = {
        showAnswer: false
      }
    }
   
    render() {
      const content = this.state.showAnswer ? this.props.backContent : this.props.frontContent;
      const iconClass = this.state.showAnswer ? 'reply' : 'share';
      const cardClass = this.state.showAnswer ? 'back' : '';
      const contentClass = this.state.showAnswer ? 'back' : 'front';
      const actionClass = this.state.showAnswer ? 'active' : '';
  
      return (
        <div 
          className={`card ${cardClass}`}
          onClick={() => this.setState({showAnswer: !this.state.showAnswer})}
        >
        <span className='card__counter'>{this.props.cardNumber + 1}</span>
          <div 
            className='card__flip-card'
            onClick={ () => {
              this.setState({showAnswer: !this.state.showAnswer});
            }}
          >
  
            <span className={`fa fa-${iconClass}`}/>
          </div>
          <div className={`card__content--${contentClass}`}>
            {content}
          </div>
          {cardClass && 
          <div className={`card__actions ${actionClass}`}>
            <div 
              className='card__prev-button'
              onClick={() => {
                this.props.showPrevCard();
                this.setState({showAnswer: false});
              }}
            >
              Prev
            </div>
            <div 
              className='card__next-button'
              onClick={() => {
                this.props.showNextCard();
                this.setState({showAnswer: false});
              }}
            >
              Next
            </div>
          </div>}
        </div>
      );
    }
  }
  
  class CardContainer extends React.Component {
    constructor() {
      super();
      this.state = {
        cardNumber: 0
      };
      this.boundCallback = this.hideCreateCard.bind(this);
      this.boundCreateCard = this.setCard.bind(this);
      this.boundShowPrevCard = this.showPrevCard.bind(this);
      this.boundShowNextCard = this.showNextCard.bind(this);
    }
    
    hideCreateCard() {
      this.setState({showModal: false});
    }
    
    showNextCard() {
      if ((this.state.cardNumber + 1) !== this.props.cards.length) {
        this.setState({cardNumber: this.state.cardNumber += 1});
      }
    }
    
    showPrevCard() {
      if (this.state.cardNumber !== 0) {
        this.setState({cardNumber: this.state.cardNumber -= 1});
      }
    }
    
    setCard(card) {
      const newCards = this.props.cards.push(card);
      this.setState({cards: newCards});
    }
    
    generateDots() {
      const times = this.props.cards.length;
      let arr = [];
      let range = n => Array.from(Array(n).keys())
      range(times).forEach((num) => {
        if (num  === this.state.cardNumber) {
            arr.push(
                <RadialSelected 
                onClick={() => this.setState({cardNumber: num})}
                />
              )
        } else {
            arr.push(
                <Radial 
                onClick={() => this.setState({cardNumber: num})}
                />
              )
        }
        
      });
      return arr;
    }
    
    generateCards() {
      const cards = this.props.cards;
      if(cards) {
        const cardsList = cards.map((card) => {
            return (
              <Card 
                frontContent={card['text']}
                backContent={card['translation']}
                showNextCard={this.boundShowNextCard}
                showPrevCard = {this.boundShowPrevCard}
                cardNumber={this.state.cardNumber}
              />
              );
          })
         return(cardsList[this.state.cardNumber]); 
      }
       
    }
    render() {
      return (
        <div>
          <span 
              className='card-container__icon  fa fa-plus' 
              onClick={() => {
                this.setState({showModal: !this.state.showModal});
              }}
            />
          {this.generateCards()}
          <div className='card-container__dots-wrapper'>
            {this.generateDots()}
          </div>
        </div>
     );
    }
  }

  
class Flashcards extends React.Component {
    constructor(props) {
      super(props);
      this.state = {cards: []};
    }

    componentWillMount() {
        const url = '/document/' + this.props.match.params.id
        fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.props.user.token,
          },
        }).then( (res) => res.json()).then((res) => {
          const getData = res
          const cards = Object.keys(getData.vocab_list).map(function(key) {
            return getData.vocab_list[key];
          });
          this.setState({cards});
        }).catch((err) => {
          console.error(err)
          // this.props.history.push('/error')
        })
    }

    render() {
        console.log("this.state.cards", this.state.cards)
        return (
            <Container style={{
                background: "#F1F1F1",
                position: "relative",
            }} loading={this.state.loading} title={"Flashcards"} description="Your generated vocab sheet">
                <CardContainer cards={this.state.cards} />
            </Container>
        )
    }
}

export default Flashcards;