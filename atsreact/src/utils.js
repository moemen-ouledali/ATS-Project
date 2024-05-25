// src/utils.js

export const calculateMatchPercentage = (requirements, resumeText, motivationLetter) => {
    if (!requirements || requirements.length === 0) {
      return 0;
    }
  
    const text = `${resumeText} ${motivationLetter}`.toLowerCase().trim();
    const totalRequirements = requirements.length;
    let matchedRequirements = 0;
  
    console.log("Requirements:", requirements); // Debug print
    console.log("Text:", text); // Debug print
  
    requirements.forEach(requirement => {
      if (text.includes(requirement.toLowerCase().trim())) {
        matchedRequirements += 1;
      } else {
        console.log("Requirement not matched:", requirement); // Debug print
      }
    });
  
    return (matchedRequirements / totalRequirements) * 100;
  };
  