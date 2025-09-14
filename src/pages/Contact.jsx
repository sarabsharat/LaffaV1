import React from 'react';
import './Contact.css';

export default function Contact() {
  const [result, setResult] = React.useState("");
  const [resultStatus, setResultStatus] = React.useState(""); // success, error, sending

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    setResultStatus("sending");

    const formData = new FormData(event.target);
    formData.append("access_key", "d356e0da-51f5-4dd9-822d-16a8cbd21d5b");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      setResultStatus("success");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
      setResultStatus("error");
    }

    setTimeout(() => {
      setResult("");
      setResultStatus("");
    }, 5000);
  };

  return (
    <div className="contact-container">
        <svg className="notedit" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 176L21.5 172.8C43 169.7 86 163.3 128.8 162.5C171.7 161.7 214.3 166.3 257.2 179.7C300 193 343 215 385.8 218.7C428.7 222.3 471.3 207.7 514.2 199.3C557 191 600 189 642.8 191.2C685.7 193.3 728.3 199.7 771.2 204.3C814 209 857 212 878.5 213.5L900 215L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#332535"/>
            <path d="M0 152L21.5 158C43 164 86 176 128.8 177.3C171.7 178.7 214.3 169.3 257.2 164.7C300 160 343 160 385.8 163C428.7 166 471.3 172 514.2 171.5C557 171 600 164 642.8 160C685.7 156 728.3 155 771.2 154C814 153 857 152 878.5 151.5L900 151L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#2f212f"/>
            <path d="M0 156L21.5 155.3C43 154.7 86 153.3 128.8 152.8C171.7 152.3 214.3 152.7 257.2 150.5C300 148.3 343 143.7 385.8 135.7C428.7 127.7 471.3 116.3 514.2 119C557 121.7 600 138.3 642.8 142C685.7 145.7 728.3 136.3 771.2 132.3C814 128.3 857 129.7 878.5 130.3L900 131L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#2b1e2a"/>
            <path d="M0 105L21.5 102.3C43 99.7 86 94.3 128.8 93.7C171.7 93 214.3 97 257.2 99.5C300 102 343 103 385.8 103.7C428.7 104.3 471.3 104.7 514.2 106.2C557 107.7 600 110.3 642.8 104.5C685.7 98.7 728.3 84.3 771.2 76.8C814 69.3 857 68.7 878.5 68.3L900 68L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#271b25"/>
            <path d="M0 36L21.5 40.7C43 45.3 86 54.7 128.8 56.7C171.7 58.7 214.3 53.3 257.2 51.7C300 50 343 52 385.8 54C428.7 56 471.3 58 514.2 60C557 62 600 64 642.8 60.7C685.7 57.3 728.3 48.7 771.2 42C814 35.3 857 30.7 878.5 28.3L900 26L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z" fill="#221820"/>
      </svg>
        <div className="contact-banner">Let's Get In Touch!</div>
      <form onSubmit={onSubmit} className="contact-form">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
        <button 
          type="submit" 
          className={`submit-btn ${resultStatus === 'success' ? 'success' : ''}`} 
          disabled={resultStatus === 'sending' || resultStatus === 'success'}
        >
            <span className="btn-text">{resultStatus === 'success' ? 'Thanks' : 'Send Message'}</span>
            <div className="check-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path fill="transparent" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
            </div>
        </button>
      </form>
      {result && <div className={`form-result ${resultStatus}`}>{result}</div>}
    </div>
  );
}
