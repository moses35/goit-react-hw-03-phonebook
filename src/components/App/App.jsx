import { Component } from 'react';
import { ContactForm } from 'components/ContactForm/ContactForm';
import { ContactList } from 'components/ContactList/ContactList';
import { Filter } from 'components/Filter/Filter';
import { Container } from 'components/App/App.styled';
import { nanoid } from 'nanoid';
import initialContacts from 'InitialContacts.json';

export class App extends Component {
  state = {
    contacts: initialContacts,
    filter: '',
  };

  formSubmitHandler = data => {
    this.duplicatedContact(data);
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizaFilter = filter.toLocaleLowerCase();
    return contacts.filter(contact =>
      contact.name.toLocaleLowerCase().includes(normalizaFilter)
    );
  };

  duplicatedContact = data => {
    const { contacts } = this.state;
    const normalizaName = data.name.toLocaleLowerCase();

    //check for duplicate name
    const result = contacts.find(
      contact => normalizaName === contact.name.toLocaleLowerCase()
    );

    //checking if find() return 'object'
    if (typeof result === 'object') {
      window.alert(result.name + ' is already in contacts');
    } else {
      data.id = nanoid();
      this.setState({ contacts: [...this.state.contacts, data] });
    }
  };

  deleteConatact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  componentDidMount() {
    const contacts = localStorage.getItem('Phonebook');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('Phonebook', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter, contacts } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <div>
          <h1>Phonebook</h1>
          <ContactForm onSubmit={this.formSubmitHandler} />
          <h2>Contacts</h2>
          <Filter value={filter} onChange={this.changeFilter} />
          {contacts.length > 0 ? (
            <ContactList
              contacts={visibleContacts}
              onDeleteContact={this.deleteConatact}
            />
          ) : (
            <p>No contacts</p>
          )}
        </div>
      </Container>
    );
  }
}
