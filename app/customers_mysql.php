<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "tc_transactions");

$result = $conn->query("select * from tc_transactions order by sender;");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"THash":"'  . $rs["tx_hash"] . '",';
    $outp .= '"Block":"'   . $rs["block"]        . '",';
    $outp .= '"From":"'. $rs["sender"]     . '"}';
}
$outp ='{"records":['.$outp.']}';
$conn->close();

echo($outp);
?>