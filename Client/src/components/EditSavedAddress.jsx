import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Row, Col } from 'react-bootstrap';
import {
  Combobox,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxInput
} from '@reach/combobox';
import '@reach/combobox/styles.css'
import usePlacesAutocomplete from 'use-places-autocomplete';

import { useEffect, useState } from 'react';
import API from '../API';

function EditSavedAddress(props) {
  const [editSavedAddressButtonSelected, setEditSavedAddressButtonSelected] = useState(false);
  const [deleteSavedAddressButtonSelected, setDeleteSavedAddressButtonSelected] = useState(false);

  const [addressContent, setAddressContent] = useState(props.savedAddresses.filter((sa) => sa.id == props.addressToBeEditedKey)[0].address);

  const startAddress = props.savedAddresses.filter((sa) => sa.id == props.addressToBeEditedKey)[0].address;
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({ callbackName: "PlacesAutocomplete" });

  useEffect(() => {
    setValue(addressContent);
  }, []);

  const handleSelect = async (address) => {
    setValue(address, false);
    setAddressContent(address);
    clearSuggestions();
  }

  const goBackIcon = (confirmation) => {
    if (startAddress !== addressContent && confirmation){
      setShowConfirmation(true);
    } else {
      !editSavedAddressButtonSelected && !deleteSavedAddressButtonSelected ?
        props.setEditSavedAddress(false)
        : editSavedAddressButtonSelected ?
          setEditSavedAddressButtonSelected(false)
          : setDeleteSavedAddressButtonSelected(false)
    }
  }

  const deleteAddress = () => {
    API.deleteSavedAddress(props.addressToBeEditedKey)
      .then(() => {
        props.setActionPerformed('Delete');
        props.setShowFeedbackPopUp(true);
        props.setDirtyAddresses(true);
        props.setEditSavedAddress(false);
      });
  }

  const updateAddress = () => {
    let newAddress = props.savedAddresses.filter((sa) => sa.id == props.addressToBeEditedKey)[0];
    newAddress.address = addressContent;
    API.updateSavedAddress(newAddress)
      .then(() => {
        props.setActionPerformed('Update');
        props.setShowFeedbackPopUp(true);
        props.setDirtyAddresses(true);
        props.setEditSavedAddress(false);
      })
      .catch(() => {
        console.log("err");
      });
  }

  return (
    <div className="edit-saved-address">
      {
        !showConfirmation ?
          <div className="back-from-edit" hidden={deleteSavedAddressButtonSelected}>
            <FontAwesomeIcon icon={faArrowLeft} /*size="xl"*/ onClick={() => goBackIcon(true)} />
          </div> : <></>
      }
      <div className="edit-address-title">
        <h1>
          {props.savedAddresses.map((sa) => sa.id == props.addressToBeEditedKey ? sa.label.toUpperCase() : null)} address
        </h1>
      </div>
      {
        !editSavedAddressButtonSelected && !deleteSavedAddressButtonSelected && !showConfirmation ?
          <>
            <div className="edit-address-content">
              {props.savedAddresses.map((sa) => sa.id == props.addressToBeEditedKey ? sa.address : null)}
            </div>
            <div className="edit-address-buttons">
              <Button className="edit-address-button" variant="dark" onClick={() => setEditSavedAddressButtonSelected(true)}>Edit<br />Address</Button>
              <Button className="edit-address-button" variant="danger" onClick={() => setDeleteSavedAddressButtonSelected(true)}>Delete<br />Address</Button>
            </div>
          </>
          : editSavedAddressButtonSelected && !showConfirmation ?
            <>
              {/*<div className="edit-address-content" style={{marginBottom: "3vh"}}>
                {addressContent}
              </div>*/}
              <Combobox onSelect={handleSelect} style={{ width: "70vw" }}>
                <ComboboxInput
                  value={value}
                  onChange={e => {
                    setValue(e.target.value);
                    setAddressContent(e.target.value);
                    if (e.target.value == '')
                      setAddressContent('');
                  }}
                  disabled={!ready}
                  placeholder="Search Address"
                  style={{ zIndex: "150", width: "-webkit-fill-available", textAlign: "center", marginTop: "3vh" }}
                  as="textarea"
                />
                <ComboboxPopover style={{ zIndex: "150" }}>
                  <ComboboxList style={{ zIndex: "150" }}>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption style={{ zIndex: "150" }} key={place_id} value={description} />)}
                  </ComboboxList>
                </ComboboxPopover>
              </Combobox>
              <div className="edit-address-buttons">
                <Button disabled={addressContent === ''} className="edit-address-button-single" variant="success" onClick={updateAddress}>Save<br />Address</Button>
              </div>
            </>
            : !showConfirmation ? <>
              <div className="delete-address-content">
                Are you sure about <b style={{ color: "red" }}>DELETING</b> your <b><i>
                  {props.savedAddresses.map((sa) => sa.id == props.addressToBeEditedKey ? sa.label.toUpperCase() : null)}
                </i></b> address ?
              </div>
              <div className="edit-address-buttons">
                <Button className="edit-address-button" variant="danger" onClick={deleteAddress}>Yes,<br />Delete</Button>
                <Button className="edit-address-button" variant="secondary" onClick={() => goBackIcon(false)}>No,<br />Go Back</Button>
              </div>
            </> : <>
                <div className="delete-address-content" style={{height: "25vh"}}>
                  Going back now will <b style={{ color: "red" }}>DISCRARD</b> your <b><i>
                  </i></b> changes in the address.<br /> Are you <i><b>SURE</b></i> you want to proceed?
                </div>
                <div className="edit-address-buttons">
                  <Button className="edit-address-button" variant="danger" onClick={() => {setAddressContent(startAddress); clearSuggestions(); setShowConfirmation(false); goBackIcon(false)}}>Yes,<br />Discard</Button>
                  <Button className="edit-address-button" variant="secondary" onClick={() => setShowConfirmation(false)}>No,<br />Go Back</Button>
                </div>
            </>
      }
    </div>
  );
}

/*
<textarea
                className="edit-address-content"
                name="edit-address-textarea"
                onChange={e=>setAddressContent(e.target.value)}
                value={addressContent}
              /> */

export { EditSavedAddress }