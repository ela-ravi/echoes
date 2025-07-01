import React, { useState } from "react";
import { Select } from "../atoms/Select";
import { Button } from "../atoms/Button";
import ContentModal from "../molecules/ContentModal";

interface TranslationSectionProps {
  onRequestTranslation: (language: string) => void;
  onLanguageChange?: (language: string) => void;
  className?: string;
}

const LANGUAGES: Array<{ value: string; label: string }> = [
  { value: "english", label: "English (Default)" },
  { value: "tam_Taml", label: "Tamil" },
  { value: "tel_Telu", label: "Telugu" },
  { value: "kan_Knda", label: "Kannada" },
  { value: "mal_Mlym", label: "Malayalam" },
  { value: "hin_Deva", label: "Hindi" },
];

const TranslationSection: React.FC<TranslationSectionProps> = ({
  onRequestTranslation,
  onLanguageChange,
  className = "",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [translationLanguage, setTranslationLanguage] = useState("tamil");
  const [showModal, setShowModal] = useState(false);
  const userType = sessionStorage.getItem("userType");
  const isClient = userType === "CLIENT";

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    console.log("===>>> newLanguage", newLanguage, e);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const handleRequestTranslation = () => {
    onRequestTranslation(translationLanguage);
    setShowModal(false);
  };

  const filteredLanguages = LANGUAGES.filter(
    (lang) => lang.value !== "english",
  );

  return (
    <div className={`bg-[#1d2030] p-4 rounded-lg ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            options={LANGUAGES}
            className="w-full"
          />
        </div>
        {isClient && (
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            className="whitespace-nowrap"
            type="button"
          >
            Request Translation
          </Button>
        )}
      </div>

      {showModal && (
        <ContentModal
          title="Request Translation"
          onClose={() => setShowModal(false)}
          content={
            <div className="space-y-4">
              <p className="text-gray-300">
                Select the language you want to translate to:
              </p>
              <Select
                value={translationLanguage}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTranslationLanguage(e.target.value)
                }
                options={filteredLanguages}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="secondary"
                  className="px-4"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestTranslation}
                  variant="primary"
                  className="px-6"
                  type="button"
                >
                  Submit
                </Button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default TranslationSection;
