<?php

function responseError($sDescription) {
	$sTmp  = '<response><data>Error: ' . $sDescription;
    die($sTmp);
}

$commandText = "";
$returnsValues = 0;
$returnsData = 0;
$bFoundReturnsDataOrValues = false;
$params = "";
$paramsSep = "";
$username = "mytdappc_root";
$password = "Bh3386#*";
$dbname = "mytdappc_tdapp";

$dataPOST = trim(file_get_contents('php://input'));
if (!empty($dataPOST)) {
    $xmlData = simplexml_load_string($dataPOST);
    header('Content-Type: application/xml');

    foreach ($xmlData->children() as $child)
    {
        if (strtolower($child->getName()) == "commandtext") {
            if ($commandText !== "") {
                responseError("Too many <commandtext> elements.");
            }
            $commandText = $child;
            $tmp = explode(" ", $commandText);
            if (count($tmp) > 1) {
                $commandText = $tmp[0];
                for ($x = 1; $x < count($tmp); $x++) {
                    $params = $params . $paramsSep . $tmp[$x];
                    $paramsSep = " ";
                }
            }
        //} elseif (strtolower($child->getName()) == "username") {
        //    if ($username !== "") {
        //        responseError("Too many <username> elements.");
        //    }
        //    $username = $child;
        //} elseif (strtolower($child->getName()) == "password") {
        //    if ($password !== "") {
        //        responseError("Too many <password> elements.");
        //    }
        //    $password = $child;
        //} elseif (strtolower($child->getName()) == "dbname") {
        //    if ($dbname !== "") {
        //        responseError("Too many <dbname> elements.");
        //    }
        //    $dbname = $child;
        } elseif (strtolower($child->getName()) == "returnsdata") {
            if ($bFoundReturnsDataOrValues) {
                responseError("Too many <returnsdata> elements, or found both <returnsdata> and <returnsvalues> elements.");
            }
            $bFoundReturnsDataOrValues = true;
            if (strtolower($child) == "true"){
                $returnsData = 1;
            } else {
                $returnsData = 0;
            }
        } elseif (strtolower($child->getName()) == "returnsvalues") {
            if ($bFoundReturnsDataOrValues) {
                responseError("Too many <returnsdata> elements, or found both <returnsdata> and <returnsvalues> elements.");
            }
            $bFoundReturnsDataOrValues = true;
            if (strtolower($child) == "true"){
                $returnsValues = 1;
            } else {
                $returnsValues = 0;
            }
        }
    }
    //if ($username === "") {
    //    responseError("Missing <username> parameter.");
    //}
    //if ($password === "") {
    //    responseError("Missing <password> parameter.");
    //}
    //if ($dbname === "") {
    //    responseError("Missing <dbname> parameter.");
    //}
    if ($commandText === "") {
        responseError("Missing <commandText> parameter.");
    }
    if (!$bFoundReturnsDataOrValues) {
        responseError("Missing <returnsdata> or <returnsValues> parameter.");
    }

    if ($params == "") {
        foreach ($xmlData->children() as $child) {
            if (strtolower($child->getName()) == "param") {
                foreach ($child->children() as $childparam) {
                    /*
                    s = s + "<name>WLAccountName</name>";
                    s = s + "<type>" + adWChar.toString() + "</type>";
                    s = s + "<direction>" + adParamInput.toString() + "</direction>";
                    s = s + "<size>" + sAccountName.length + "</size>";
                    s = s + "<value>" + sAccountName + "</value>";
                     */
                    if (strtolower($childparam->getName()) == "value") {
                        $params = $params . $paramsSep . "'" . $childparam . "'";
                        $paramsSep = ",";
                        break;
                    }
                }
            }
        }
    }

    //responseError("commandText = " . $commandText . ", returnsData = " . $returnsData . ", returnsValues = " . $returnsValues . ", params = " . $params . ", username = " . $username . ", password = " . $password . ", dbname = " . $dbname);

    //open connection to mysql db
    $connection = mysqli_connect("localhost",$username,$password,$dbname) or responseError("Error " . mysqli_error($connection));

    //execute query in mysql db
    $sql = "call " . $commandText . "(" . $params . ")";
    $result = mysqli_query($connection, $sql) or responseError("Error executing query " . mysqli_error($connection));

    if (($returnsData == 1) || ($returnsValues == 1)) {
        //create an array
        $emparray = array();
        while($row =mysqli_fetch_assoc($result))
        {
            $emparray[] = $row;
        }
        echo json_encode($emparray);

        //close the db connection
        mysqli_close($connection);

    }
} else {
    responseError("Missing input data");
}
?>