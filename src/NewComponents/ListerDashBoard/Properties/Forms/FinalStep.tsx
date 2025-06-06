import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  FaCreditCard, FaPlus } from 'react-icons/fa';
import { StepProps } from '../propertyTypes';
import ImageUploadModal from './ImageModal';
import TermsPopup from './TermsPopUp';
import { uploadImageToGCS } from '../../../../services/imageUpload';
import ErrorProperty from '../../../Errors/ErrorProperty';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (images: string[]) => void;
}

const FinalStep: React.FC<StepProps> = ({ formData, setFormData }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [isTermsOpen, setIsTermsOpen] = React.useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [termsError, setTermsError] = useState<string | null>(null);

        const handleImagesUpload = (newImages: string[]) => {
            // Clear any previous errors
            setImageError(null);
            
            if (newImages.length === 0) {
                setImageError("No images were uploaded. Please try again.");
                return;
            }
            
            setFormData({
                ...formData,
                images: [...(formData.images || []), ...newImages]
            });
        };

        const handleRemoveImage = (indexToRemove: number) => {
            setFormData({
                ...formData,
                images: (formData.images || []).filter((_, index) => index !== indexToRemove)
            });
        };

        const handleTermsAcceptedChange = (accepted: boolean) => {
            // Clear terms error when user checks the box
            if (accepted) {
                setTermsError(null);
            }
            
            setFormData({
                ...formData,
                termsAccepted: accepted
            });
        };

    return (
        <motion.div 
            className="space-y-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
            {/* Images Section */}
            <div className="space-y-2">
                <label className="font-helvetica-regular text-slategray block mb-2">Property Images</label>

                {imageError && (
                    <div className="mb-4">
                        <ErrorProperty 
                            message={imageError} 
                            type="missingfields" 
                            actionLabel="Add Images"
                            onAction={() => {
                            setImageError(null);
                            setIsUploadModalOpen(true);
                            }}
                            mode="toast"
                        />
                    </div>
                )}

                <div className="grid grid-cols-4 gap-4">
                    {(formData.images || []).map((image, index) => (
                        <div key={index} className="relative group">
                            <img 
                                src={image} 
                                alt={`Property ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-celadon hover:border-celadon transition-colors"
                    >
                        <FaPlus className="mr-2" />
                        Add Images
                    </button>
                </div>
            </div>

            {/* Additional Comments Section */}
            <div className="space-y-2">
                <label className="font-helvetica-regular text-slategray block mb-2">Additional Comments</label>
                <textarea
                    value={formData.additionalComments || ''}
                    onChange={(e) => setFormData({...formData, additionalComments: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:border-celadon outline-none min-h-[100px] resize-y"
                    placeholder="Add any additional details about your property..."
                />
            </div>

            {/* Existing Checkboxes */}
            <div className="space-y-3">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={formData.cryptoAccepted}
                        onChange={(e) => setFormData({...formData, cryptoAccepted: e.target.checked})}
                        className="text-celadon"
                    />
                    <span className="font-helvetica-light text-slategray">Accept Cryptocurrency</span>
                </label>

                    {termsError && (
                    <div className="my-3">
                        <ErrorProperty 
                            message={termsError} 
                            type="missingfields" 
                            actionLabel="Read Terms"
                            onAction={() => {
                            setTermsError(null);
                            setIsTermsOpen(true);
                            }}
                            mode="toast"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsTermsOpen(true)}
                        className="text-rustyred hover:underline text-sm font-helvetica-light"
                    >
                        Read terms and conditions
                    </button>
                </div>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                        className="text-celadon"
                    />
                    <span className="font-helvetica-light text-slategray">I accept the terms and conditions</span>
                </label>
            </div>

            <div className="flex items-center space-x-4">
                <FaCreditCard className="text-celadon text-xl" />
                <span className="font-helvetica-light text-slategray">Final Step</span>
            </div>

            {/* This is where your image upload modal component would be rendered */}
            {isUploadModalOpen && (
                <ImageUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleImagesUpload}
                />
            )}

              <TermsPopup 
                  isOpen={isTermsOpen}
                  onClose={() => setIsTermsOpen(false)}
              />
        </motion.div>
    );
};

export default FinalStep;