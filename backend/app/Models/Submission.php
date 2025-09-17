<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = ['form_id'];
    public function answers(){ return $this->hasMany(SubmissionAnswer::class); }
    public function form(){ return $this->belongsTo(Form::class); }
}
