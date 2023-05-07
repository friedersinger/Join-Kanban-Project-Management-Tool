<?php

########### CONFIG ###########################

$redirect = 'success_forget_pw.html';                 //setting redirection to success page 

########### CONFIG END #######################


##############################################
#
#   SENDING PERSONALIZED EMAIL TO USER
#
##############################################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $email = $_POST['email'];           //getting email from inputfield and putting it in a variable

        $message = "Hello,\n                            
        \nFollow this link to reset the password for your Join account.\n
        \nhttps://gruppe-557.developerakademie.net/Join-1.0/index.html?email={$email}\n   
        \nIgnore this email if you did not ask to reset your password.\n
        \nThank you,\n
        \nJoin team\n";
                       // message for the user with personilzed link to reset password

        $recipient = $email;                // setting recipient to the email from inputfield
        $subject = "Join - Reset password";
        $headers = "From:  noreply@join.de";

        mail($recipient, $subject, $message, $headers); //sending out email with the parameters inside --> () the round brackets
        
        header("Location: " . $redirect);  // redirect to success page

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
