import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPremiumDialogIsOpen } from '../../redux/actions/uiActions';
import { fetchUserValue } from '../../redux/selectors/userSelectors';
import { getPremiumDialogIsOpen } from '../../redux/selectors/uiSelectors';

import './PremiumDialog.scss';
import AlertDialog from '../AlertDialog/AlertDialog';


const PremiumDialog = () => {
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const showDialog = useSelector(getPremiumDialogIsOpen);
    const dispatch = useDispatch();
    const user = useSelector(fetchUserValue);

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.parentElement?.className.includes("alert-dialog")) {
                setShowAlertDialog(false);
            }

            if (event.target.className.includes("dialog-main-box")) {
                dispatch(setPremiumDialogIsOpen(false));
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    if (!showDialog) {
        return null;
    }
    
    function handleCloseAlertDialog() {
        setShowAlertDialog(false);
    }

    function showBillingHelpDialog() {
        setShowAlertDialog(true);
    }

    function handleInputChange() {

    }

    return (
        <div className='premium-dialog dialog'>
            {
                showAlertDialog && (
                    <AlertDialog
                        title="billing help"
                        text="If you need help with a billing issue, please contact us at info@unleashedai.com"
                        onOk={handleCloseAlertDialog} onClose={handleCloseAlertDialog}
                    />
                )
            }
            <div className="main-box dialog-main-box">
                <div className="main-box-container dialog-container">
                    <div className='main-box-header'>
                        <div className='premium-dialog-header'>
                            <div className='main-box-title premium-dialog-title'>upgrade to Plus</div>
                            <div className='premium-dialog-subtitle'>USD $20/month</div>
                        </div>
                    </div>
                    <div className='bordered-top'></div>
                    <div className='main-box-body'>
                        <div className='main-box-body-row'>
                        </div>
                        <div className='main-box-body-row column-direction'>
                            <div className='main-box-body-row-item'>access to GPT-4</div>
                            <div className='main-box-body-row-item subtext'>most capable and performant model</div>
                        </div>
                        <div className='main-box-body-row column-direction'>
                            <div className='main-box-body-row-item'>unlimited messages per day</div>
                        </div>
                        <div className='main-box-body-row column-direction'>
                            <div className='main-box-body-row-item'>increased memory limit</div>
                            <div className='main-box-body-row-item subtext'>memorize up to 100 messages from the chat</div>
                        </div>
                        <div className='main-box-body-row column-direction'>
                            <div className='main-box-body-row-item'>access to all Plus roles</div>
                        </div>
                        <div className='main-box-body-row column-direction'>
                            <div className='main-box-body-row-item'>access to advanced options</div>
                        </div>
                        <div className='main-box-body-row'>
                        </div>
                        <div className='main-box-body-row'>
                            <div className="links-main" onClick={showBillingHelpDialog}>
                                billing help
                            </div>
                        </div>
                        <div className='premium-dialog-header'>
                            <div className='main-box-title premium-dialog-cta'>upgrade now</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumDialog;
