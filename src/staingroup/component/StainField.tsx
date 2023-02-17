import { useState } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';

import { StainListItem, useStains } from '../../stain';
import { Stain } from '../../context/optemis';

import './StainField.css';

const StainField = ({ labId }: Props) => {
  const { stains, isLoading } = useStains(labId);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [selectedStains, setSelectedStains] = useState<string[]>([]);

  return (
    <FieldArray name="stains">
      {({
        push,
        remove,
        form: { values, setFieldValue, validateForm, setFieldTouched },
      }: FieldArrayRenderProps) => {
        const getAvailableStains = () => {
          const usedStainList = values.stains.map((stain: Stain) => stain.id);
          return stains?.filter(({ id }) => !usedStainList.includes(id));
        };

        const addStains = () => {
          selectedStains.forEach((selectedId) =>
            push(stains?.find((stain) => stain.id === selectedId))
          );
          setShowModal(false);
        };

        return (
          <>
            <div className="stainfield-header">
              <span>Stain list</span>
              <Button
                type="button"
                label="Add stain"
                loading={isLoading}
                className="p-button-text p-button-sm"
                icon={<FontAwesomeIcon icon={faPlus} className="pr-3" />}
                onClick={() => {
                  setSelectedStains([]);
                  setShowModal(true);
                }}
              />
            </div>
            <div className="stainfield-list">
              {values.stains && values.stains.length > 0 ? (
                values.stains.map((stain: Stain, index: number) => (
                  <StainListItem
                    stain={stain}
                    external
                    allowDelete
                    onDelete={() => setConfirmDeleteItem(index)}
                  />
                ))
              ) : (
                <span className="text-sm text-muted">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="pr-3" />
                  No stains found
                </span>
              )}
            </div>
            <ConfirmDialog
              visible={confirmDeleteItem !== -1}
              onHide={() => setConfirmDeleteItem(-1)}
              message="Are you sure you want to delete the stain? "
              header="Confirmation"
              icon="pi pi-exclamation-triangle"
              accept={() => remove(confirmDeleteItem)}
              reject={() => setConfirmDeleteItem(-1)}
            />

            <Dialog
              header="Add stains to group"
              closable={true}
              draggable={false}
              visible={showModal}
              style={{ width: '25vw' }}
              onHide={() => setShowModal(false)}
              footer={
                <div>
                  <Button
                    label="Cancel"
                    className="p-button-outlined p-button-secondary"
                    onClick={() => setShowModal(false)}
                  />
                  <Button
                    label="Ok"
                    onClick={addStains}
                    disabled={selectedStains.length === 0}
                  />
                </div>
              }
            >
              <ListBox
                multiple
                value={selectedStains}
                onChange={(e) => setSelectedStains(e.value)}
                options={getAvailableStains()}
                optionLabel="description"
                className="w-full md:w-14rem"
                optionValue="id"
              />
            </Dialog>
          </>
        );
      }}
    </FieldArray>
  );
};

type Props = {
  labId: string;
};

export { StainField };