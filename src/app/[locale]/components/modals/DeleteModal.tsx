import React, { ComponentProps } from 'react';
import Modal from './Modal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props {
    title: string;
    description: string;
    handler: ComponentProps<any>;
    handlerClose?: ComponentProps<any>;
    btnTitle: string;
    showModal: boolean;
    setShowModal: (b: boolean) => void;
}

export default function DeleteModal({
    title,
    description,
    handler,
    handlerClose,
    btnTitle,
    showModal,
    setShowModal,
}: Props) {
    const classContainer = '';

    return (
        <Modal
            title={title}
            description={description}
            icon={faTrash}
            handler={async () => handler()}
            handlerClose={() => handlerClose()}
            showModal={showModal}
            setShowModal={setShowModal}
            classContainer={classContainer}
            btnTitle={btnTitle}
        >
            <></>
        </Modal>
    );
}
